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

git checkout -b develop scratch-gui
git merge scratch-blocks --allow-unrelated-histories --no-edit
git merge scratch-vm --allow-unrelated-histories --no-edit
git merge scratch-render --allow-unrelated-histories --no-edit
 
#TODO: ADD SCRATCH-PAINT IF NECESSARYRRYY @ampelc


cd ../monorepo

git remote add upstream ../temp-monorepo
git fetch upstream

# Find the most recent upstream commit already present in our history via patch-id
git log upstream/develop --no-merges -p | git patch-id --stable > /tmp/upstream-pids.txt
git log --no-merges -p | git patch-id --stable > /tmp/ours-pids.txt

# Match: upstream patch-id that also appears in our history → that commit's upstream hash
SYNC_POINT=$(awk 'NR==FNR{seen[$1]=1; next} seen[$1]{print $2; exit}' \
    /tmp/ours-pids.txt /tmp/upstream-pids.txt)

git checkout -B upstream-update-$(date +%Y-%m-%d)

set +e
PR_NUMBER=$(gh pr list --head upstream-update-$(date +%Y-%m-%d) --json number --jq '.[0].number')
if [ -n "$SYNC_POINT" ]; then
    # Take the changes from SYNC_POINT to upstream/develop and replay them onto current branch
    git rebase --onto HEAD ${SYNC_POINT} upstream/develop
else
    git merge upstream/develop --allow-unrelated-histories --no-commit --no-edit
fi
MERGE_STATUS=$?
set -e

if [ $MERGE_STATUS -eq 0 ]; then
    rm -f .git/MERGE_HEAD
    git commit -m "chore: upstream update $(date)"
    git push origin upstream-update-$(date +%Y-%m-%d) --force
    gh pr create --head upstream-update-$(date +%Y-%m-%d) --base main --title "Upstream update $(date)" --body "Updated packages from upstream. pls review" -r supervoidcoder,ampelc,someCatinTheWorld || gh pr comment "$PR_NUMBER" --body "It seems there's already an opened PR for this update. I have updated the branch. pls review, procrastinating on upstream changes isn't very nice"
else
    CONFLICTED_FILES=$(git diff --name-only --diff-filter=U)
    for file in $CONFLICTED_FILES; do
        git checkout --theirs "$file"
        git add "$file"
    done
    rm -f .git/MERGE_HEAD
    git add .
    git commit -m "chore: upstream update $(date) — took upstream on conflicts"
    git push origin upstream-update-$(date +%Y-%m-%d) --force
    gh pr create --head upstream-update-$(date +%Y-%m-%d) --base main --title "Upstream update $(date) (has conflicts)" --body "# THERE ARE CONFLICTS IN THIS AUTOMATIC PR. PLEASE DO NOT MERGE UNTIL THEY ARE RESOLVED. ⚠️🚨⚠️🚨⚠️🚨⚠️🚨⚠️🚨⚠️🚨" --draft -r supervoidcoder,ampelc,someCatinTheWorld || gh pr comment "$PR_NUMBER" --body "It seems there's already an opened PR for this update. I have updated the branch. pls review, procrastinating on upstream changes isn't very nice. **ALSO, THERE ARE CONFLICTS**⚠️🚨⚠️🚨⚠️⚠️⚠️⚠️⚠️⚠️🚨🚨🚨🚨🚨🚨"
fi