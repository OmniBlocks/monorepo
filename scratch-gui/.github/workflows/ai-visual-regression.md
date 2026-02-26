---
description: >-
  AI-powered visual regression testing for OmniBlocks UI changes. A vision-capable
  agent builds the app, intelligently navigates the UI using Playwright, captures
  screenshots, and compares them against cached baselines. Only runs on non-draft
  PRs from org members when UI-related files have changed.
on:
  pull_request:
    types: [opened, synchronize, reopened, ready_for_review]
    paths:
      - 'src/**'
      - 'static/**'
      - 'webpack.config.js'
      - 'webpack*.js'
      - 'package.json'
  roles: [admin, maintainer, write]
if: ${{ github.event.pull_request.draft == false }}
concurrency:
  group: ai-visual-regression-${{ github.event.pull_request.number }}
  cancel-in-progress: true
permissions:
  contents: read
  pull-requests: read
  issues: read
engine: copilot
strict: false
steps:
  - name: Checkout PR code
    uses: actions/checkout@v4
    with:
      ref: ${{ github.event.pull_request.head.sha }}
      fetch-depth: 0
      persist-credentials: false
tools:
  playwright: {}
  bash:
    - "npm *"
    - "npx *"
    - "node *"
    - "mkdir *"
    - "cp *"
    - "git *"
    - "curl *"
    - "cat *"
    - "ls *"
    - "echo *"
    - "kill *"
    - "sleep *"
  github:
    toolsets: [default, pull_requests]
  cache-memory:
    key: ai-vrt-baselines-${{ github.event.repository.default_branch }}
    retention-days: 30
    allowed-extensions: [".png", ".json"]
safe-outputs:
  add-comment:
    max: 1
    hide-older-comments: true
network:
  allowed:
    - localhost
    - 127.0.0.1
    # "node" is a gh-aw ecosystem identifier that allows access to registry.npmjs.org
    # required for `npm ci` / `npm install` during the build step
    - node
timeout-minutes: 60
---

# AI Visual Regression Tester

You are an AI visual regression testing agent for **OmniBlocks** — a high-performance Scratch/TurboWarp fork block-based IDE. Your task is to analyze UI changes in pull request #${{ github.event.pull_request.number }}, build the application, navigate it using Playwright, capture screenshots, and compare them against cached baselines.

## Context

- **PR**: #${{ github.event.pull_request.number }} — ${{ github.event.pull_request.title }}
- **Author**: @${{ github.actor }}
- **Workspace**: The PR code is already checked out at `$GITHUB_WORKSPACE`

## Step 1: Analyze What Changed

Use your GitHub tools to get the full list of changed files in this PR. Understand which visual areas are affected:

- `src/components/` → React UI components (highest priority)
- `src/containers/` → Redux-connected components
- `src/lib/themes/` → Theme/color changes
- `src/css/` → Global stylesheets
- `static/` → Static assets and images

If the PR only modifies non-visual files (e.g., `src/reducers/`, test files, `src/lib/tw-translations/`, workflow configs, or README), post a brief comment noting no visual testing is needed and stop — do not proceed to build.

## Step 2: Build the Application

From `$GITHUB_WORKSPACE`, install dependencies and build:

```bash
npm ci || npm install --legacy-peer-deps
npm run build
```

Verify that the `build/` directory is non-empty. If the build fails, post a comment explaining the build failure with the key error messages and stop.

## Step 3: Serve the Built App

Start a local HTTP server for the build output and wait until it is ready:

```bash
npx http-server build -p 8080 --silent &
# Poll until the server responds (up to 30 seconds)
for i in $(seq 1 30); do curl -fsS http://localhost:8080/ > /dev/null 2>&1 && break; sleep 1; done
```

Confirm the server is responding at `http://localhost:8080/`.

## Step 4: Capture Screenshots with Playwright

Use Playwright to navigate the OmniBlocks editor. The built app serves `editor.html` as its main entry point at `http://localhost:8080/editor.html`. Verify this file exists in `build/` before navigating; if the file is missing, check for `index.html` or `app.html` as alternatives.

Before taking any screenshot:
1. Wait for `[class*="menu-bar"]` to be visible (signals the editor has fully loaded)
2. Wait an additional 1–2 seconds for animations to settle

Capture these views at minimum, saving to `/tmp/vrt-current/`:

1. **Full editor initial load** — full-page screenshot (`editor-initial.png`)
2. **Menu bar area** — the top navigation bar (`menu-bar.png`)
3. **Blocks workspace** — the blocks palette and code area (`blocks-workspace.png`)
4. **Stage and sprites panel** — the right-side stage + sprite list (`stage-sprites.png`)

Additionally, for each component specifically changed by this PR (identified in Step 1), navigate to and screenshot the relevant UI area with a descriptive filename.

## Step 5: Compare Against Baselines

Check if baseline screenshots exist in `/tmp/gh-aw/cache-memory/baselines/`.

**If no baselines exist (first run):**
- Copy `/tmp/vrt-current/` to `/tmp/gh-aw/cache-memory/baselines/`
- Save a `manifest.json` in the baselines directory with the list of screenshots and a timestamp
- Post a comment: "🎯 AI Visual Regression baselines initialized — N screenshots captured. Future PRs will be compared against this baseline."

**If baselines exist:**
Compare each screenshot against its baseline using your vision capability. For each screenshot, describe:
- Whether the layout, colors, or elements changed significantly
- Any new UI elements added or removed
- Any repositioning or size changes

Be specific about what you observe visually.

## Step 6: Post Results

Post a comment on PR #${{ github.event.pull_request.number }} with:

```
## 🔍 AI Visual Regression Report

**PR**: #${{ github.event.pull_request.number }} — ${{ github.event.pull_request.title }}
**Tested areas**: [list based on Step 1 diff analysis]

### Results

| Screenshot | Status | Notes |
|-----------|--------|-------|
| editor-initial | ✅ No change / ⚠️ Changed | [description] |
| menu-bar | ... | ... |
| blocks-workspace | ... | ... |
| stage-sprites | ... | ... |

### Summary

[Brief summary of visual changes detected, or confirmation that no visual regressions were found]

[If changes detected, describe what visually changed and where]
```

If no visual changes were detected across all tested areas, post a concise "✅ AI Visual Regression: no visual changes detected across N screenshots." comment.
