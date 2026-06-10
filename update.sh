#!/bin/bash

git config user.name "github-actions[bot]"
git config user.email "41898282+github-actions[bot]@users.noreply.github.com"

pip install git-filter-repo

mkdir scratch-gui-temp
cd scratch-gui-temp
git init 
git remote add upstream https://github.com/TurboWarp/scratch-gui.git
git fetch upstream develop
git checkout -b develop placeholder
git-filter-repo --to-subdirectory-filter scratch-gui 

cd ../

mkdir scratch-blocks-temp
cd scratch-blocks-temp
git init
git remote add upstream https://github.com/TurboWarp/scratch-blocks.git
git fetch upstream develop
git checkout -b develop placeholder
git-filter-repo --to-subdirectory-filter scratch-blocks

cd ../

mkdir scratch-vm-temp
cd scratch-vm-temp
git init
git remote add upstream https://github.com/TurboWarp/scratch-vm.git
git fetch upstream develop
git checkout -b develop placeholder
git-filter-repo --to-subdirectory-filter scratch-vm

cd ../

mkdir scratch-render
cd scratch-render
git init
git remote add upstream https://github.com/TurboWarp/scratch-render.git
git fetch upstream develop
git checkout -b develop placeholder
git-filter-repo --to-subdirectory-filter scratch-render

git checkout -b upstream-update
 
cd ..

# TODO: parse it to look good in the PR description 



if git merge  ./scratch-gui-temp --allow-unrelated-histories --no-edit
