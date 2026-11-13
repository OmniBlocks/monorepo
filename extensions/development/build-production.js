import * as pathUtil from "node:path";
import * as fs from "node:fs/promises";
import Builder from "./builder.js";

async function folderExists(dirPath) { // ob: stole this from google
  // used to check if its inside the monorepo to put it directly inside scratch-gui
  try {
    const stats = await fs.stat(dirPath);
    return stats.isDirectory();
  } catch {
    return false;
  }
}


const diry = pathUtil.join(import.meta.dirname, "../../scratch-gui");
let outputDirectory;
let l10nOutput;
if (await folderExists(diry)) {
  // places the build directory right in scratch-gui upon build, making sure it appears at the same level as the page (omniblocks.org/extensions)
  outputDirectory = pathUtil.join(diry, "extensions/build");
  l10nOutput = pathUtil.join(diry, "extensions/build-l10n");
} else {
  outputDirectory = pathUtil.join(import.meta.dirname, "../build");
  l10nOutput = pathUtil.join(import.meta.dirname, "../build-l10n");
}

const builder = new Builder("production");
const build = await builder.build();

await build.export(outputDirectory);
console.log(`Built to ${outputDirectory}`);

await build.exportL10N(l10nOutput);
console.log(`Exported L10N to ${l10nOutput}`);
