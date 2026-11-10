#!/bin/bash
set -e

git config --global user.name "github-actions[bot]"
git config --global user.email "41898282+github-actions[bot]@users.noreply.github.com"
pipx install git-filter-repo
 
PACKAGES=("scratch-gui" "scratch-blocks" "scratch-vm" "scratch-render" "scratch-storage") 
REPOS=("TurboWarp" "TurboWarp" "TurboWarp" "TurboWarp" "TurboWarp")
# in case we ever need to upstream from a repo that isn't turbowarp, like pmod or ultrabox
MONOREPO_DIR=$(pwd)
DATE_SUFFIX=$(date +%Y-%m-%d)

for i in "${!PACKAGES[@]}"; do 
    PKG="${PACKAGES[$i]}"
    REPO="${REPOS[$i]}"
    cd ../
    rm -rf "temp-$PKG"
    git clone "https://github.com/$REPO/$PKG.git" "temp-$PKG"
    cd "temp-$PKG" 
    git filter-repo --to-subdirectory-filter "$PKG" --force 
    git remote add monorepo "$MONOREPO_DIR"
    
    BRANCH_NAME="upstream-sync-$PKG-$DATE_SUFFIX"
    git push -f monorepo HEAD:refs/heads/"$BRANCH_NAME" 
    cd "$MONOREPO_DIR"
    git push -f origin "$BRANCH_NAME" 
    git fetch origin main || true
    
    set +e
    git merge-base --is-ancestor "$BRANCH_NAME" "origin/main" 2>/dev/null
    IS_ANCESTOR_REMOTE=$?
    git merge-base --is-ancestor "$BRANCH_NAME" "main" 2>/dev/null
    IS_ANCESTOR_LOCAL=$?
    set -e
    
    if [ $IS_ANCESTOR_REMOTE -eq 0 ] || [ $IS_ANCESTOR_LOCAL -eq 0 ]; then 
        git push origin --delete "$BRANCH_NAME" || true
        rm -rf "../temp-$PKG"
        continue
    fi 
    set +e
    PR_NUMBER=$(gh pr list --head "$BRANCH_NAME" --json number --jq '.[0].number')
    set -e
    
    if [ -z "$PR_NUMBER" ]; then 
        gh pr create \
            --head "$BRANCH_NAME" \
            --base main \
            --title "Upstream sync: $PKG ($(date +%Y-%m-%d))" \
            --body "Automated upstream sync for \`$PKG\`. PLS REVIEW" \
            -r supervoidcoder,ampelc,someCatinTheWorld
    else 
        gh pr comment "$PR_NUMBER" --body "ive updated this branch pls review"
    fi
     
    rm -rf "../temp-$PKG"
done