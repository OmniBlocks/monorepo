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

git checkout -B upstream-update-$(date +%Y-%m-%d)

# TODO: parse it to look good in the PR description 

# apparently you need to set this because STUPID GITHUB ACTIONS WILL EXPLODE VIOLENTLY AND DIE if you don't
set +e
PR_NUMBER=$(gh pr list --head upstream-update-$(date +%Y-%m-%d) --json number --jq '.[0].number')
set -e
git push origin upstream-update-$(date +%Y-%m-%d) --force
if git merge upstream/develop --allow-unrelated-histories --no-edit; then
    git push origin upstream-update-$(date +%Y-%m-%d) --force
    gh pr create --head upstream-update-$(date +%Y-%m-%d) --base main --title "Upstream update $(date)" --body "Updated packages from upstream. pls review" -r supervoidcoder,ampelc,someCatinTheWorld || gh pr comment "$PR_NUMBER" --body "It seems there's already an opened PR for this update. I have updated the branch. pls review, procrastinating on upstream changes isn't  very nice" 
else
    CONFLICTED=$(git diff --name-only --diff-filter=U)

    if [ -z "$CONFLICTED" ]; then
        git merge --abort
    else
        echo "$CONFLICTED" | xargs -I{} git checkout --theirs -- {}
        git add .
        git commit -m "chore: upstream update $(date) [conflicts need resolution]"
    fi

    git push origin upstream-update-$(date +%Y-%m-%d) --force

    set +e
    PR_NUMBER=$(gh pr list --head "upstream-update-$(date +%Y-%m-%d)" --json number --jq '.[0].number')
    set -e

    gh pr create --head upstream-update-$(date +%Y-%m-%d) --base main --title "Upstream update $(date) (has conflicts)" --body "# THERE ARE CONFLICTS IN THIS AUTOMATIC PR. PLEASE DO NOT MERGE UNTIL THEY ARE RESOLVED. ⚠️🚨⚠️🚨⚠️🚨⚠️🚨⚠️🚨⚠️🚨" --draft -r supervoidcoder,ampelc,someCatinTheWorld || gh pr comment "$PR_NUMBER" --body "It seems there's already an opened PR for this update. I have updated the branch. pls review, procrastinating on upstream changes isn't  very nice. **ALSO, THERE ARE CONFLICTS**⚠️🚨⚠️🚨⚠️⚠️⚠️⚠️⚠️⚠️🚨🚨🚨🚨🚨🚨"
fi