---
description: Merges changes from TurboWarp and PenguinMod upstreams
on:
  schedule: daily on weekdays
  workflow_dispatch:
permissions:
  contents: read
  issues: read
  pull-requests: read
tools:
  github:
    toolsets: [default]
  bash: true
safe-outputs:
  create-pull-request:
    max: 5
steps:
  - name: Install git-filter-repo
    run: |
      sudo apt-get update
      sudo apt-get install -y git-filter-repo
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
   - Clone the upstream repository into a temporary directory.
   - Since these are brought in as standard folders and not subtrees, use `git-filter-repo --to-subdirectory-filter <package-name>` on the cloned repo to rewrite everything into the corresponding directory format.
   - We need to merge them into our monorepo. Add the rewritten local path as a remote: `git remote add upstream-<package-name> <path>`
   - `git fetch upstream-<package-name>`
   - Do a test commit bringing the thingies into a new branch (do not commit to the main branch).

3. Create a pull request using the `create-pull-request` safe output:
   - Request reviewers: `supervoidcoder`, `ampelc`.
   - Explain what packages were updated from upstreams.
   - If there were merge conflicts, open the PR as a draft (`draft: true`).
