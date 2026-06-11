#!/bin/bash

git config --global user.name "github-actions[bot]"
git config --global user.email "41898282+github-actions[bot]@users.noreply.github.com"

pip install git-filter-repo

cd ../ 
mkdir temp-monorepo
cd temp-monorepo
git init

git remote add upstream-gui https://github.com/TurboWarp/scratch-gui.git
git fetch upstream-gui develop
git checkout -b scratch-gui upstream-gui/develop
git-filter-repo --to-subdirectory-filter scratch-gui --refs scratch-gui --force

git remote add upstream-blocks https://github.com/TurboWarp/scratch-blocks.git
git fetch upstream-blocks develop
git checkout -b scratch-blocks upstream-blocks/develop
git-filter-repo --to-subdirectory-filter scratch-blocks --refs scratch-blocks --force

git remote add upstream-vm https://github.com/TurboWarp/scratch-vm.git
git fetch upstream-vm develop
git checkout -b scratch-vm upstream-vm/develop
git-filter-repo --to-subdirectory-filter scratch-vm --refs scratch-vm --force

git remote add upstream-render https://github.com/TurboWarp/scratch-render.git
git fetch upstream-render develop
git checkout -b scratch-render upstream-render/develop
git-filter-repo --to-subdirectory-filter scratch-render --refs scratch-render --force

git remote add upstream-paint https://github.com/TurboWarp/scratch-paint.git
git fetch upstream-paint develop
git checkout -b scratch-paint upstream-paint/develop
git-filter-repo --to-subdirectory-filter scratch-paint --refs scratch-paint --force

git checkout -b develop scratch-gui
git merge scratch-blocks --allow-unrelated-histories --no-edit
git merge scratch-vm --allow-unrelated-histories --no-edit
git merge scratch-render --allow-unrelated-histories --no-edit
git merge scratch-paint --allow-unrelated-histories --no-edit

cd ../monorepo

git remote add upstream ../temp-monorepo
git fetch upstream

# Add --reverse so the oldest commits are at the top, and the newest matches are at the bottom
git log upstream/develop --reverse --no-merges -p | git patch-id --stable > /tmp/upstream-pids.txt
git log --reverse --no-merges -p | git patch-id --stable > /tmp/ours-pids.txt

# Keep the exact same awk matching logic, but update it to track the last match found
SYNC_POINT=$(awk 'NR==FNR{seen[$1]=1; next} seen[$1]{last=$2} END{print last}' \
    /tmp/ours-pids.txt /tmp/upstream-pids.txt)
echo "🔍 SYNC_POINT: $SYNC_POINT"

git checkout -B upstream-update-$(date +%Y-%m-%d)

set +e
PR_NUMBER=$(gh pr list --head upstream-update-$(date +%Y-%m-%d) --json number --jq '.[0].number')
echo "🔍 PR_NUMBER: $PR_NUMBER"

if [ -n "$SYNC_POINT" ]; then
    echo "Sync point found at $SYNC_POINT. Applying new upstream commits..."
    # Cherry-pick the exact range of new TurboWarp commits
    git cherry-pick ${SYNC_POINT}..upstream/develop --no-commit
else
    echo "No sync point found. Falling back to standard merge..."
    git merge upstream/develop --allow-unrelated-histories --no-commit --no-edit
fi
MERGE_STATUS=$?
echo "🔍 MERGE_STATUS: $MERGE_STATUS"
set -e

# If the new commits apply perfectly cleanly
if [ $MERGE_STATUS -eq 0 ]; then
    rm -f .git/CHERRY_PICK_HEAD .git/MERGE_HEAD
    git commit -m "chore: upstream update $(date)" --allow-empty
    git push origin upstream-update-$(date +%Y-%m-%d) --force
    gh pr create --head upstream-update-$(date +%Y-%m-%d) --base main --title "Upstream update $(date)" --body "Updated packages from upstream. pls review" -r supervoidcoder,ampelc,someCatinTheWorld || gh pr comment "$PR_NUMBER" --body "It seems there's already an opened PR for this update. I have updated the branch. pls review, procrastinating on upstream changes isn't very nice"
else
    # IF THERE ARE CONFLICTS:
    # Do NOT run a loop that over-writes files. 
    # Just leave the raw conflicts exactly as they are so GitHub detects them!
    
    echo "Conflicts detected in the new upstream commits. Pushing to PR for review."
    
    # Stage the conflicted states so git allows us to commit the branch
    git add . 
    
    # Commit it as a conflict-warning state
    git commit -m "chore: upstream update $(date) — needs manual conflict resolution" --allow-empty
    git push origin upstream-update-$(date +%Y-%m-%d) --force
    
    # Create the draft PR so you can review the conflicts on GitHub
    gh pr create --head upstream-update-$(date +%Y-%m-%d) --base main --title "Upstream update $(date) (has conflicts)" --body "# THERE ARE CONFLICTS IN THIS AUTOMATIC PR. PLEASE DO NOT MERGE UNTIL THEY ARE RESOLVED. ⚠️🚨⚠️🚨⚠️🚨⚠️🚨⚠️🚨⚠️🚨" --draft -r supervoidcoder,ampelc,someCatinTheWorld || gh pr comment "$PR_NUMBER" --body "It seems there's already an opened PR for this update. I have updated the branch. pls review, procrastinating on upstream changes isn't very nice. **ALSO, THERE ARE CONFLICTS**⚠️🚨⚠️🚨⚠️⚠️⚠️⚠️⚠️⚠️🚨🚨🚨🚨🚨🚨"
fi