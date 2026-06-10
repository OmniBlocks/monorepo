#!/bin/bash

git config user.name "github-actions[bot]"
git config user.email "41898282+github-actions[bot]@users.noreply.github.com"

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

git checkout -b develop

git merge scratch-gui --allow-unrelated-histories --no-edit
git merge scratch-blocks --allow-unrelated-histories --no-edit
git merge scratch-vm --allow-unrelated-histories --no-edit
git merge scratch-render --allow-unrelated-histories --no-edit
 
#TODO: ADD SCRATCH-PAINT IF NECESSARYRRYY @ampelc


cd ../monorepo

git remote add upstream ../temp-monorepo

git checkout -b upstream-update

# TODO: parse it to look good in the PR description 

# apparently you need to set this because STUPID GITHUB ACTIONS WILL EXPLODE VIOLENTLY AND DIE if you don't
set +e

if git merge upstream/develop --allow-unrelated-histories --no-edit; then
    git add . 
    git commit -m "chore: UPDATE UPSTREAM $(date)"
    git checkout main
    git push 
    gh pr create --title "Upstream update $(date)" --body "Updated packages from upstream. pls review" -r @OmniBlocks/coders 
else
    git add . 
    git commit -m "chore: UPDATE UPSTREAM $(date)"
    git checkout main
    git push 
    gh pr create --title "Upstream update $(date) (has conflicts)" --body "# THERE ARE CONFLICTS IN THIS AUTOMATIC PR. PLEASE DO NOT MERGE UNTIL THEY ARE RESOLVED. ⚠️🚨⚠️🚨⚠️🚨⚠️🚨⚠️🚨⚠️🚨" --draft -r @OmniBlocks/coders 