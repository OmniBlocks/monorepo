---
description: Merges changes from TurboWarp and PenguinMod upstreams
on:
  schedule: daily on weekdays
  workflow_dispatch:
permissions:
  contents: read
  issues: read
  pull-requests: read
engine:
  id: copilot
  model: claude-haiku-4.5
tools:
  github:
    toolsets: [default]
  bash: true
safe-outputs:
  create-pull-request:
    max: 6
    patch-format: bundle
---

# Auto Upstream Merger

You are an AI agent responsible for syncing local packages with their upstream repositories.

## Your Task

1. The upstream repositories for the monorepo packages are:
   - `scratch-gui` -> `https://github.com/TurboWarp/scratch-gui.git`
   - `scratch-vm` -> `https://github.com/TurboWarp/scratch-vm.git`
   - `scratch-blocks` -> `https://github.com/TurboWarp/scratch-blocks.git`
   - `scratch-render` -> `https://github.com/TurboWarp/scratch-render.git`
   - `scratch-svg-renderer` -> `https://github.com/TurboWarp/scratch-svg-renderer.git`
   - `scratch-paint` -> `https://github.com/PenguinMod/PenguinMod-Paint.git`

2. For each package listed above:
   - Fetch the upstream branch using `git fetch <upstream_url> master` (or their default branch).
   - Perform a subtree-aware merge using `git merge --allow-unrelated-histories -s ort -Xsubtree=<package-name> FETCH_HEAD` (do not use --squash).
   - Commit the merge result to a dedicated branch named `upstream-sync/<package-name>-<YYYYMMDD>`; do not push to the default branch.

3. Create a pull request using the `create-pull-request` safe output:
   - Request reviewers: `supervoidcoder`, `ampelc`.
   - Explain what packages were updated from upstreams.
   - If there were merge conflicts, open the PR as a draft (`draft: true`).
