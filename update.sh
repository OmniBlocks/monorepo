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

cd ../monorepo
git remote add upstream ../temp-monorepo
git fetch upstream

# --- BOOTSTRAP UPSTREAM-BRANCH ---
git fetch origin || true
if ! git show-ref --verify --quiet refs/remotes/origin/upstream-branch; then
    echo "Initializing upstream-branch for the first time..."
    git checkout --orphan upstream-branch
    git rm -rf .
    git merge upstream/scratch-gui --allow-unrelated-histories --no-edit --quiet
    git merge upstream/scratch-blocks --allow-unrelated-histories --no-edit --quiet
    git merge upstream/scratch-vm --allow-unrelated-histories --no-edit --quiet
    git merge upstream/scratch-render --allow-unrelated-histories --no-edit --quiet
    git merge upstream/scratch-paint --allow-unrelated-histories --no-edit --quiet
    git push origin upstream-branch
    
    git checkout main
    if git merge -s ours upstream-branch --allow-unrelated-histories -m "chore: link upstream-branch history" && git push origin main; then
        echo "Successfully linked upstream-branch to main!"
    else
        git checkout -b link-upstream-branch
        git merge -s ours upstream-branch --allow-unrelated-histories -m "chore: link upstream-branch history"
        git push origin link-upstream-branch --force
        gh pr create --head link-upstream-branch --base main --title "Bootstrap: Link Upstream History" --body "Please merge this PR to link the histories."
        echo "Bootstrap PR created. Please merge it, then run the action again!"
        exit 0
    fi
fi

git fetch origin upstream-branch
git checkout -B upstream-branch origin/upstream-branch
git checkout -B upstream-update-$(date +%Y-%m-%d)
# ---------------------------------

PR_NUMBER=$(gh pr list --head upstream-update-$(date +%Y-%m-%d) --json number --jq '.[0].number')
echo "🔍 PR_NUMBER: $PR_NUMBER"

git log HEAD --no-merges --format="%ad %s" --date=unix > /tmp/our-commits.txt
CONFLICT_FOUND=0
set +e

git log upstream/scratch-gui --no-merges --format="%ad %s|%H" --date=unix > /tmp/upstream-gui-commits.txt
SYNC_POINT_GUI=$(awk -F'|' 'NR==FNR{hash[$1]=$2; next} $0 in hash {print hash[$0]; exit}' /tmp/upstream-gui-commits.txt /tmp/our-commits.txt)
if [ -n "$SYNC_POINT_GUI" ]; then
    git cherry-pick ${SYNC_POINT_GUI}..upstream/scratch-gui --no-commit
    if [ $? -ne 0 ]; then
        CONFLICT_FOUND=1
        git add .
        git commit -m "chore: upstream conflicts in scratch-gui" --allow-empty
    fi
fi

git log upstream/scratch-blocks --no-merges --format="%ad %s|%H" --date=unix > /tmp/upstream-blocks-commits.txt
SYNC_POINT_BLOCKS=$(awk -F'|' 'NR==FNR{hash[$1]=$2; next} $0 in hash {print hash[$0]; exit}' /tmp/upstream-blocks-commits.txt /tmp/our-commits.txt)
if [ -n "$SYNC_POINT_BLOCKS" ]; then
    git cherry-pick ${SYNC_POINT_BLOCKS}..upstream/scratch-blocks --no-commit
    if [ $? -ne 0 ]; then
        CONFLICT_FOUND=1
        git add .
        git commit -m "chore: upstream conflicts in scratch-blocks" --allow-empty
    fi
fi

git log upstream/scratch-vm --no-merges --format="%ad %s|%H" --date=unix > /tmp/upstream-vm-commits.txt
SYNC_POINT_VM=$(awk -F'|' 'NR==FNR{hash[$1]=$2; next} $0 in hash {print hash[$0]; exit}' /tmp/upstream-vm-commits.txt /tmp/our-commits.txt)
if [ -n "$SYNC_POINT_VM" ]; then
    git cherry-pick ${SYNC_POINT_VM}..upstream/scratch-vm --no-commit
    if [ $? -ne 0 ]; then
        CONFLICT_FOUND=1
        git add .
        git commit -m "chore: upstream conflicts in scratch-vm" --allow-empty
    fi
fi

git log upstream/scratch-render --no-merges --format="%ad %s|%H" --date=unix > /tmp/upstream-render-commits.txt
SYNC_POINT_RENDER=$(awk -F'|' 'NR==FNR{hash[$1]=$2; next} $0 in hash {print hash[$0]; exit}' /tmp/upstream-render-commits.txt /tmp/our-commits.txt)
if [ -n "$SYNC_POINT_RENDER" ]; then
    git cherry-pick ${SYNC_POINT_RENDER}..upstream/scratch-render --no-commit
    if [ $? -ne 0 ]; then
        CONFLICT_FOUND=1
        git add .
        git commit -m "chore: upstream conflicts in scratch-render" --allow-empty
    fi
fi

git log upstream/scratch-paint --no-merges --format="%ad %s|%H" --date=unix > /tmp/upstream-paint-commits.txt
SYNC_POINT_PAINT=$(awk -F'|' 'NR==FNR{hash[$1]=$2; next} $0 in hash {print hash[$0]; exit}' /tmp/upstream-paint-commits.txt /tmp/our-commits.txt)
if [ -n "$SYNC_POINT_PAINT" ]; then
    git cherry-pick ${SYNC_POINT_PAINT}..upstream/scratch-paint --no-commit
    if [ $? -ne 0 ]; then
        CONFLICT_FOUND=1
        git add .
        git commit -m "chore: upstream conflicts in scratch-paint" --allow-empty
    fi
fi

# --- LOCAL MERGE TEST TO DETECT CONFLICTS ---
git checkout -b test-merge-branch upstream-update-$(date +%Y-%m-%d)
set +e
git merge origin/main --no-commit --no-edit
if [ $? -ne 0 ]; then
    CONFLICT_FOUND=1
    git merge --abort
fi
set -e
git checkout upstream-update-$(date +%Y-%m-%d)
git branch -D test-merge-branch
# --------------------------------------------

set -e

if [ $CONFLICT_FOUND -eq 0 ]; then
    rm -f .git/CHERRY_PICK_HEAD .git/MERGE_HEAD
    git commit -m "chore: upstream update $(date)" --allow-empty
    git push origin upstream-update-$(date +%Y-%m-%d) --force
    git push origin upstream-update-$(date +%Y-%m-%d):upstream-branch --force
    gh pr create --head upstream-update-$(date +%Y-%m-%d) --base main --title "Upstream update $(date)" --body "Updated packages from upstream. pls review" -r supervoidcoder,ampelc,someCatinTheWorld || gh pr comment "$PR_NUMBER" --body "It seems there's already an opened PR for this update. I have updated the branch. pls review, procrastinating on upstream changes isn't very nice"
else
    git add . 
    git commit -m "chore: upstream update $(date) — needs manual conflict resolution" --allow-empty
    git push origin upstream-update-$(date +%Y-%m-%d) --force
    git push origin upstream-update-$(date +%Y-%m-%d):upstream-branch --force
    gh pr create --head upstream-update-$(date +%Y-%m-%d) --base main --title "Upstream update $(date) (has conflicts)" --body "# THERE ARE CONFLICTS IN THIS AUTOMATIC PR. PLEASE DO NOT MERGE UNTIL THEY ARE RESOLVED. ⚠️🚨⚠️🚨⚠️🚨" --draft -r supervoidcoder,ampelc,someCatinTheWorld || gh pr comment "$PR_NUMBER" --body "It seems there's already an opened PR for this update. I have updated the branch. pls review, procrastinating on upstream changes isn't very nice. **ALSO, THERE ARE CONFLICTS**⚠️🚨"
fi