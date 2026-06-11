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

git checkout -fB upstream-update-$(date +%Y-%m-%d) upstream/develop
 
set +e
git merge main --no-commit --no-edit
MERGE_STATUS=$?
set -e

if [ $MERGE_STATUS -eq 0 ]; then 
    git commit -m "chore: upstream update $(date)"
    git push origin upstream-update-$(date +%Y-%m-%d) --force
    gh pr create --head upstream-update-$(date +%Y-%m-%d) --base main --title "Upstream update $(date)" --body "Updated packages from upstream. pls review" -r supervoidcoder,ampelc,someCatinTheWorld || gh pr comment --body "I have updated the branch. pls review, procrastinating on upstream changes isn't very nice"
else 
    CONFLICTED_FILES=$(git diff --name-only --diff-filter=U)
    CONFLICT_TMP=$(mktemp -d)
    
    for file in $CONFLICTED_FILES; do
        if [ -f "$file" ]; then
            mkdir -p "$CONFLICT_TMP/$(dirname "$file")"
            python3 - "$file" "$CONFLICT_TMP/$file" <<'PYEOF'
import sys, pathlib
def take_theirs(text):
    out, in_ours, in_theirs = [], False, False
    for line in text.splitlines(keepends=True):
        if line.startswith('<<<<<<<'):
            in_ours, in_theirs = True, False
        elif line.startswith('=======') and in_ours:
            in_ours, in_theirs = False, True
        elif line.startswith('>>>>>>>') and in_theirs:
            in_theirs = False
        elif not in_ours:
            out.append(line)
    return ''.join(out)
src, dst = pathlib.Path(sys.argv[1]), pathlib.Path(sys.argv[2])
dst.write_text(take_theirs(src.read_text(encoding='utf-8', errors='replace')), encoding='utf-8')
PYEOF
        fi
    done
     
    git merge --abort
    for file in $CONFLICTED_FILES; do
        if [ -f "$CONFLICT_TMP/$file" ]; then
            cp "$CONFLICT_TMP/$file" "$file"
        fi
    done
    rm -rf "$CONFLICT_TMP"
    
    git add .
    git commit -m "chore: upstream update $(date) — took upstream on conflicts"
    git push origin upstream-update-$(date +%Y-%m-%d) --force

fi