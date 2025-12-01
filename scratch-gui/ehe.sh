#!/bin/bash

# --- Configuration ---
# ⚠️ UPDATE THIS URL if it is different!
UPSTREAM_URL="https://github.com/TurboWarp/scratch-gui.git"
OLD_BASE_BRANCH="main"
NEW_BASE_BRANCH="develop"
UPSTREAM_BRANCH="develop" # The branch name you want to merge from upstream
ORIGIN_REMOTE="origin"
PUSH_COMMANDS_FILE="force_push_commands.sh"

echo "--- Starting Full Git History Merge and Branch Rename ---"
echo "Upstream URL: $UPSTREAM_URL"
echo "New Base Branch: $NEW_BASE_BRANCH"
echo "--------------------------------------------------------"

# Clear any previous push commands file
> "$PUSH_COMMANDS_FILE"

# Function to record the necessary force push command
add_push_command() {
    BRANCH_NAME=$1
    echo "git push $ORIGIN_REMOTE $BRANCH_NAME --force-with-lease" >> "$PUSH_COMMANDS_FILE"
}

# --- PART 1: Setup and Merge the Base Branch Histories ---

echo "1. Adding upstream remote..."
git remote add upstream "$UPSTREAM_URL" || true

echo "2. Fetching upstream history..."
git fetch upstream

echo "3. Checking out $OLD_BASE_BRANCH..."
git checkout "$OLD_BASE_BRANCH"

echo "4. Merging upstream/$UPSTREAM_BRANCH history with --allow-unrelated-histories..."
git merge upstream/"$UPSTREAM_BRANCH" --allow-unrelated-histories

if [ $? -ne 0 ]; then
    echo "======================================================================="
    echo "🛑 CONFLICT DETECTED during initial merge."
    echo "Please resolve conflicts, run 'git add .', then 'git commit'."
    echo "Then re-run this script to continue with the rename and feature branches."
    echo "======================================================================="
    exit 1
fi

echo "5. Renaming local branch from $OLD_BASE_BRANCH to $NEW_BASE_BRANCH..."
git branch -m "$NEW_BASE_BRANCH"

echo "6. Recording commands to delete old remote branch and push new base branch..."
# Record the delete and force push commands for the base branch
echo "# BASE BRANCH COMMANDS" >> "$PUSH_COMMANDS_FILE"
echo "git push $ORIGIN_REMOTE :$OLD_BASE_BRANCH" >> "$PUSH_COMMANDS_FILE"
add_push_command "$NEW_BASE_BRANCH"
echo "" >> "$PUSH_COMMANDS_FILE"

echo "✅ Base branch merged and renamed to '$NEW_BASE_BRANCH'. Commands recorded in $PUSH_COMMANDS_FILE."
echo "--------------------------------------------------------"

# --- PART 2: Rebase and Fix All Feature Branches ---

echo "--- Starting Mass Rebase of Feature Branches ---"
echo "# FEATURE BRANCH COMMANDS" >> "$PUSH_COMMANDS_FILE"

# 1. Get a list of all local branches, excluding the old and new base branches
BRANCHES=$(git branch --list | grep -v "$OLD_BASE_BRANCH" | grep -v "$NEW_BASE_BRANCH" | sed 's/^\* //g' | xargs)

if [ -z "$BRANCHES" ]; then
    echo "No other branches found to process."
else
    echo "Found branches to process:"
    echo "$BRANCHES"
    echo "------------------------------------------------"

    # 2. Loop through each feature branch
    for BRANCH in $BRANCHES; do
        echo "➡️ Processing branch: $BRANCH"
        
        git checkout "$BRANCH"
        
        echo "  > Rebasing $BRANCH onto $NEW_BASE_BRANCH..."
        git rebase "$NEW_BASE_BRANCH"
        
        # Check the exit status of the rebase command
        if [ $? -ne 0 ]; then
            echo "======================================================================="
            echo "🛑 CONFLICT DETECTED on branch: $BRANCH"
            echo "Please resolve conflicts, then run 'git add .' and 'git rebase --continue'."
            echo "Then re-run this script to process the remaining branches."
            echo "The push command for this branch will be recorded upon successful rebase."
            echo "======================================================================="
            exit 1
        fi
        
        echo "  > Rebase successful. Recording force push command for $ORIGIN_REMOTE/$BRANCH..."
        add_push_command "$BRANCH"

        echo "✅ Finished processing $BRANCH. Push command recorded."
        echo "------------------------------------------------"

    done
fi

# 3. Final steps
git checkout "$NEW_BASE_BRANCH"
echo "--- Script finished. All branches have been merged/rebased. ---"
echo "--- ⚠️ NEXT STEP IS CRITICAL ⚠️ ---"
echo "Please inspect the generated file: **$PUSH_COMMANDS_FILE**"
echo "Then, run the commands in the file to update your remote fork."
echo "Example: source $PUSH_COMMANDS_FILE"