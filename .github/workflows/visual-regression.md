---
description: Visual regression testing using Playwright and AI
on:
  pull_request:
    types: [opened, synchronize]
  workflow_dispatch:
permissions:
  contents: read
  pull-requests: read
tools:
  playwright: {}
  cache-memory: true
  bash: true
safe-outputs:
  add-comment:
    max: 1
  upload-asset:
    max: 10
---

# Visual Regression Tester

You are an AI agent designed to perform visual regression testing on a web application.

## Your Task

1. The workspace has been checked out. The application should be built before testing. Build the application using:
   `pnpm install && pnpm --recursive run prepublish --if-present && pnpm --recursive run prepublishOnly --if-present && pnpm --recursive run build --if-present`
2. Start the `scratch-gui` preview server in the background. Wait for it to become accessible (e.g. `http://localhost:8601` or similar).
3. Use the `playwright` tool to navigate to the locally served application.
4. Click around the UI to explore new features introduced in this pull request. Review the actual pictures/screenshots of the interface.
5. Take screenshots of the application, focusing on modified areas or new features. Store them in a temporary directory like `/tmp/screenshots/`.
6. Use the `upload-asset` safe output tool for each screenshot using their absolute paths to get asset URLs.
7. Post a comment on the pull request using the `add-comment` safe output. Include the asset URLs of the screenshots in your comment to show what the new features look like, and detail any visual differences or observations you made.

If no changes are detected, call the `noop` safe output to gracefully complete.
