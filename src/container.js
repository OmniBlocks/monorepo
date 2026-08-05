import { spawn, execFile } from "child_process";
import { promisify } from "util";
import path from "node:path";
import { loadTodoList, loadReviews, loadContainerMap, saveContainerMap } from "./fs.js";

const execFileAsync = promisify(execFile);

const SSH_HOST = process.env.BOXY_SSH_HOST;
const SSH_PORT = process.env.BOXY_SSH_PORT || "22";
const SSH_USER = process.env.BOXY_SSH_USER;
const SSH_PASSWORD = process.env.BOXY_SSH_PASSWORD;
const REMOTE_BASE = process.env.BOXY_REMOTE_WORKSPACE || `/home/${SSH_USER}/boxy-workspace`;
const DEFAULT_WORKSPACE = `${REMOTE_BASE}/default`;
const MAX_OUTPUT_SIZE = 200000;

let activeShell = null;
let activeTask = null;
let currentWorkspacePath = DEFAULT_WORKSPACE;
let shellPromise = null;

function shQuote(value) {
  return `'${String(value).replace(/'/g, `'\\''`)}'`;
}

function assertSafeContainerKey(key) {
  if (typeof key !== "string" || !/^[A-Za-z0-9_-]+$/.test(key)) {
    throw new Error(`Invalid container key: ${key}`);
  }
}

function assertSafeBranchName(branch) {
  if (typeof branch !== "string" || !branch || branch.startsWith("-")) {
    throw new Error(`Invalid branch name: ${branch}`);
  }
}

function assertSafeCloneUrl(url) {
  if (typeof url !== "string" || !/^(https?:\/\/|git@)/.test(url)) {
    throw new Error(`Invalid repository clone URL: ${url}`);
  }
}

function sshArgs(remoteCommand) {
  if (!SSH_HOST || !SSH_USER || !SSH_PASSWORD) {
    throw new Error("Missing SSH credentials: set BOXY_SSH_HOST, BOXY_SSH_USER and BOXY_SSH_PASSWORD in .env");
  }
  const args = [
    "-e", "ssh",
    "-p", SSH_PORT,
    "-t",
    "-o", "StrictHostKeyChecking=accept-new",
    "-o", "LogLevel=ERROR",
    "-q",
    `${SSH_USER}@${SSH_HOST}`,
  ];
  if (remoteCommand !== undefined) args.push(remoteCommand);
  return args;
}

function runRemoteCommand(remoteCommand) {
  return execFileAsync("sshpass", sshArgs(remoteCommand), {
    env: { ...process.env, SSHPASS: SSH_PASSWORD },
    maxBuffer: 10 * 1024 * 1024,
  });
}

async function ensureVmReady() {
  try {
    await runRemoteCommand(`mkdir -p ${shQuote(REMOTE_BASE)} ${shQuote(DEFAULT_WORKSPACE)}`);
  } catch (err) {
    throw new Error(`Could not reach Boxy's VM over SSH (${SSH_USER}@${SSH_HOST}:${SSH_PORT}): ${err.message}`);
  }
}

async function getShell() {
  if (activeShell && !activeShell.killed) return activeShell;
  if (shellPromise) return shellPromise;

  shellPromise = (async () => {
    await ensureVmReady();

    const shell = spawn("sshpass", sshArgs("/bin/sh"), {
      env: { ...process.env, SSHPASS: SSH_PASSWORD },
    });

    shell.stdout.on("data", (data) => {
      if (!activeTask) return;
      activeTask.stdout += data.toString();

      if (activeTask.stdout.length > MAX_OUTPUT_SIZE) {
        activeTask.stdout = "[...OUTPUT TRUNCATED DUE TO SIZE LIMIT...]\n" + activeTask.stdout.slice(-MAX_OUTPUT_SIZE);
      }
    });

    shell.stderr.on("data", (data) => {
      if (!activeTask) return;
      activeTask.stderr += data.toString();

      if (activeTask.stderr.length > MAX_OUTPUT_SIZE) {
        activeTask.stderr = "[...STDERR TRUNCATED DUE TO SIZE LIMIT...]\n" + activeTask.stderr.slice(-MAX_OUTPUT_SIZE);
      }
    });

    shell.on("error", (err) => {
      activeShell = null;
      if (activeTask) {
        activeTask.status = "closed";
        activeTask.stderr += `\n[shell error] ${err.message}`;
      }
    });

    shell.on("close", () => {
      activeShell = null;
      if (activeTask) {
        activeTask.status = "closed";
      }
    });

    shell.stdin.write(`mkdir -p ${shQuote(currentWorkspacePath)}; cd ${shQuote(currentWorkspacePath)}\n`);

    activeShell = shell;
    return shell;
  })().finally(() => {
    shellPromise = null;
  });

  return shellPromise;
}

export async function runCommandInBoxyContainer(command, isBoxyWebhook = false, token = null, timeSliceMs = 10000) {
  let isBusy = false;
  const todoList = await loadTodoList();
  for (const [id, item] of Object.entries(todoList)) {
    if (!item.completed) { isBusy = true; break; }
  }
  if (!isBusy) {
    const reviews = await loadReviews();
    if (Object.keys(reviews).length > 0) isBusy = true;
  }


  const shellProcess = await getShell();

  if (activeTask && command) {
    if (isBusy && isBoxyWebhook) {
    return { stdout: "", stderr: "You're using the computer to work on another task on your to-do list right now.", exitCode: 1 };
  } else {
    return {
      status: "busy",
      stderr: "The container is currently busy executing another command. Use 'send_stdin' to reply to prompts, 'wait_command' to give it more time, or 'kill_command' to stop it.",
      exitCode: 1
    };
  }
  }

  if (!activeTask && command) {
    const uniqueDelimiter = `__BOXY_DELIM_${Date.now()}_${Math.random().toString(36).substring(2, 9)}__`;
    const pidFile = `/tmp/.boxy_pid_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    activeTask = {
      stdout: "",
      stderr: "",
      status: "running",
      delimiter: uniqueDelimiter,
      pidFile,
      command
    };

    let credentialPrefix = "";
    if (token && (command.includes("git") || command.includes("gh"))) {
      const rewriteKey = `url.https://x-access-token:${token}@github.com/.insteadOf`;
      credentialPrefix =
        `GIT_CONFIG_COUNT=1 ` +
        `GIT_CONFIG_KEY_0=${shQuote(rewriteKey)} ` +
        `GIT_CONFIG_VALUE_0=${shQuote("https://github.com/")} ` +
        `GITHUB_TOKEN=${shQuote(token)} `;
    }

    const safeCmd = command.replace(/'/g, "'\\''");
    const wrappedStr =
      `${credentialPrefix}setsid sh -c 'printf "%s\\n" "$$" > "${pidFile}"; ${safeCmd}'; ` +
      `echo "${uniqueDelimiter}$?"\n`;

    shellProcess.stdin.write(wrappedStr);
  }

  const startTime = Date.now();
  while (Date.now() - startTime < timeSliceMs) {
    if (!activeTask) break;

    const delimIndex = activeTask.stdout.indexOf(activeTask.delimiter);
    if (delimIndex !== -1) {
      const outputParts = activeTask.stdout.split(activeTask.delimiter);
      const cleanStdout = outputParts[0].trim();
      const exitCodeMatch = outputParts[1].match(/^(\d+)/);
      const exitCode = exitCodeMatch ? parseInt(exitCodeMatch[1], 10) : 0;
      const cleanStderr = activeTask.stderr.trim();

      if (activeTask.pidFile) {
        runRemoteCommand(`rm -f ${shQuote(activeTask.pidFile)}`).catch(() => {});
      }

      activeTask = null;
      return { status: "completed", stdout: cleanStdout, stderr: cleanStderr, exitCode };
    }

    if (activeTask.status === "closed") {
      activeTask = null;
      return { status: "failed", stderr: "Shell process closed unexpectedly.", exitCode: 1 };
    }

    await new Promise(r => setTimeout(r, 200));
  }

  return {
    status: "still_running",
    stdout: activeTask ? activeTask.stdout.trim() : "",
    stderr: activeTask ? activeTask.stderr.trim() : "",
    message: "The command is taking longer than usual or waiting for interactive input. You can call 'send_stdin' to respond, 'wait_command' to continue waiting, or 'kill_command' to terminate it."
  };
}

export async function sendStdinToBoxyContainer(text) {
  if (!activeShell || !activeTask) {
    return { error: "No command is currently running to send input to." };
  }

  const input = text.endsWith("\n") ? text : text + "\n";
  activeShell.stdin.write(input);

  return await runCommandInBoxyContainer(null, false, null, 10000);
}

export async function waitCommandInBoxyContainer(timeSliceMs = 10000) {
  if (!activeTask) {
    return { error: "No command is currently running to wait for." };
  }
  return await runCommandInBoxyContainer(null, false, null, timeSliceMs);
}

export async function killCommandInBoxyContainer() {
  if (!activeTask) {
    return { error: "No command is currently running to kill." };
  }

  const task = activeTask;
  const { pidFile } = task;

  try {
    const { stdout } = await runRemoteCommand(
      `i=0; ` +
      `while [ ! -s ${shQuote(pidFile)} ] && [ "$i" -lt 40 ]; do ` +
      `sleep 0.05; i=$((i + 1)); ` +
      `done; ` +
      `cat ${shQuote(pidFile)} 2>/dev/null || true`
    );

    const pgid = stdout.trim();

    if (!/^[0-9]+$/.test(pgid)) {
      return {
        status: "still_running",
        message: "The command is starting and cannot be cancelled yet. Try kill_command again momentarily.",
        last_stdout: task.stdout.split(task.delimiter)[0].trim(),
        last_stderr: task.stderr.trim()
      };
    }

    await runRemoteCommand(`kill -9 -- "-${pgid}" 2>/dev/null || true`);

    const { stdout: exitedOut } = await runRemoteCommand(
      `i=0; while kill -0 -- "-${pgid}" 2>/dev/null && [ "$i" -lt 40 ]; do sleep 0.05; i=$((i + 1)); done; ` +
      `if kill -0 -- "-${pgid}" 2>/dev/null; then echo alive; else echo exited; fi`
    );
    const groupExited = exitedOut.trim() === "exited";

    if (!groupExited) {
      return {
        status: "still_running",
        message: "SIGKILL was sent, but the command process group has not exited yet. Try kill_command again.",
        last_stdout: task.stdout.split(task.delimiter)[0].trim(),
        last_stderr: task.stderr.trim()
      };
    }

    const partialStdout = task.stdout.split(task.delimiter)[0].trim();
    const partialStderr = task.stderr.trim();

    if (activeTask === task) {
      activeTask = null;
    }

    await runRemoteCommand(`rm -f ${shQuote(pidFile)}`).catch(() => {});

    return {
      status: "killed",
      message: "Command process group and its descendants were forcefully terminated.",
      last_stdout: partialStdout,
      last_stderr: partialStderr
    };
  } catch (err) {
    return {
      status: "failed",
      message: `Failed to cancel command: ${err.message}`,
      last_stdout: task.stdout.split(task.delimiter)[0].trim(),
      last_stderr: task.stderr.trim()
    };
  }
}

function runRemoteExec(remoteCommand, input) {
  return new Promise((resolve, reject) => {
    const child = spawn("sshpass", sshArgs(remoteCommand), {
      env: { ...process.env, SSHPASS: SSH_PASSWORD },
    });
    let stdout = "";
    let stderr = "";

    child.stdout.on("data", (data) => { stdout += data.toString(); });
    child.stderr.on("data", (data) => { stderr += data.toString(); });
    child.on("error", reject);
    child.on("close", (code) => {
      if (code !== 0) {
        reject(new Error(stderr.trim() || `ssh command exited with code ${code}`));
      } else {
        resolve(stdout);
      }
    });

    if (input !== undefined) child.stdin.write(input);
    child.stdin.end();
  });
}

function resolveWorkspacePath(filePath) {
  const resolved = path.resolve(currentWorkspacePath, filePath);
  if (resolved !== currentWorkspacePath && !resolved.startsWith(currentWorkspacePath + path.sep)) {
    throw new Error(`Access denied: path is outside ${currentWorkspacePath}`);
  }
  return resolved;
}

export async function editFileInBoxyContainer(filePath, edits) {
  if (activeTask) {
    return { error: "The computer is currently busy running another command. Use 'wait_command' or 'kill_command' before editing files." };
  }
  if (typeof filePath !== "string" || !filePath) {
    return { error: "No file path was provided." };
  }
  if (!Array.isArray(edits) || edits.length === 0) {
    return { error: "No edits were provided." };
  }

  await ensureVmReady();
  const target = resolveWorkspacePath(filePath);

  let content;
  try {
    content = await runRemoteExec(`cat ${shQuote(target)}`);
  } catch (err) {
    return { error: `Could not read '${target}': ${err.message}. This tool only edits files that already exist. Use execute_command to create new files.` };
  }

  let updated = content;
  for (let i = 0; i < edits.length; i++) {
    const { old_string, new_string, replace_all } = edits[i] || {};
    if (typeof old_string !== "string" || typeof new_string !== "string") {
      return { error: `Edit #${i + 1} is missing 'old_string' or 'new_string'. No changes were written.` };
    }
    if (old_string === new_string) {
      return { error: `Edit #${i + 1} has an identical 'old_string' and 'new_string', so it would do nothing. No changes were written.` };
    }
    const occurrences = updated.split(old_string).length - 1;
    if (occurrences === 0) {
      return { error: `Edit #${i + 1}: 'old_string' was not found in '${target}'. No changes were written. Re-read the file to confirm its exact current content, including whitespace.` };
    }
    if (occurrences > 1 && !replace_all) {
      return { error: `Edit #${i + 1}: 'old_string' matches ${occurrences} locations in '${target}', but must be unique. Add more surrounding context to 'old_string', or set 'replace_all: true' to replace every occurrence. No changes were written.` };
    }
    updated = replace_all ? updated.split(old_string).join(new_string) : updated.replace(old_string, new_string);
  }

  if (updated === content) {
    return { error: "No changes were made to the file." };
  }

  try {
    await runRemoteExec(`dd of=${shQuote(target)}`, updated);
  } catch (err) {
    return { error: `Failed to write '${target}': ${err.message}` };
  }

  return {
    status: "success",
    path: target,
    edits_applied: edits.length,
    message: `Applied ${edits.length} edit(s) to '${target}'.`
  };
}

export async function getBoxyCwd() {
  const result = await runCommandInBoxyContainer("pwd", false);
  return result.status === "completed" ? result.stdout.trim() : currentWorkspacePath;
}

export async function createBoxyContainer(key, repoCloneUrl, branch) {
  if (activeTask) {
    throw new Error("Cannot switch workspaces while a command is running. Wait for or cancel the active command first.");
  }
  assertSafeContainerKey(key);
  assertSafeCloneUrl(repoCloneUrl);
  assertSafeBranchName(branch);

  await ensureVmReady();

  const containerMap = await loadContainerMap();
  const remotePath = `${REMOTE_BASE}/${key}`;
  const existing = containerMap[key];

  let reused = false;
  if (existing) {
    try {
      await runRemoteCommand(`test -d ${shQuote(remotePath + "/.git")}`);
      reused = true;
    } catch {
      reused = false;
    }
  }

  if (reused) {
    await runRemoteCommand(
      `cd ${shQuote(remotePath)} && git fetch origin ${shQuote(branch)} && git checkout ${shQuote(branch)} && git reset --hard ${shQuote("origin/" + branch)}`
    );
  } else {
    await runRemoteCommand(
      `rm -rf ${shQuote(remotePath)} && git clone --branch ${shQuote(branch)} --single-branch ${shQuote(repoCloneUrl)} ${shQuote(remotePath)}`
    );
  }

  containerMap[key] = { path: remotePath, repoCloneUrl, branch, updatedAt: new Date().toISOString() };
  await saveContainerMap(containerMap);

  currentWorkspacePath = remotePath;
  if (activeShell && !activeShell.killed) {
    activeShell.stdin.write(`cd ${shQuote(remotePath)}\n`);
  }

  return { containerName: key, reused, path: remotePath };
}

export async function destroyBoxyContainer(key) {
  if (activeTask) {
    throw new Error("Cannot destroy a workspace while a command is running. Wait for or cancel the active command first.");
  }

  const containerMap = await loadContainerMap();
  const entry = containerMap[key];
  if (!entry) return false;

  await runRemoteCommand(`rm -rf ${shQuote(entry.path)}`).catch(() => {});

  delete containerMap[key];
  await saveContainerMap(containerMap);

  if (currentWorkspacePath === entry.path) {
    currentWorkspacePath = DEFAULT_WORKSPACE;
    if (activeShell && !activeShell.killed) {
      activeShell.stdin.write(`cd ${shQuote(DEFAULT_WORKSPACE)}\n`);
    }
  }

  return true;
}
