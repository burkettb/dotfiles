#!/bin/bash
# Directory containing all your projects
PROJECTS_DIR="$HOME/dev"  # adjust as needed

# Iterate through each subdirectory in the projects folder
for repo_dir in "$PROJECTS_DIR"/*/; do
    # Remove trailing slash and get the base directory name
    base_repo_dir=$(basename "${repo_dir}")

    if [ -d "${repo_dir}/.git" ]; then
        # Change to the repo directory
        cd "${repo_dir}" || continue

        # Check for local modifications:
        # 'git diff-index' returns non-zero if there are local changes.
        git update-index -q --refresh
        if ! git diff-index --quiet HEAD --; then
            local_status="dirty"
        else
            local_status="clean"
        fi

        # Check for remote status:
        # First, fetch remote changes quietly.
        git fetch &>/dev/null

        # Retrieve commit hashes for local, remote tracking branch, and their merge-base.
        local_commit=$(git rev-parse @ 2>/dev/null)
        remote_commit=$(git rev-parse @{u} 2>/dev/null)
        base_commit=$(git merge-base @ @{u} 2>/dev/null)

        if [ -z "$remote_commit" ]; then
            remote_status="no upstream"
        elif [ "$local_commit" = "$remote_commit" ]; then
            remote_status="up-to-date"
        elif [ "$local_commit" = "$base_commit" ]; then
            remote_status="behind"
        elif [ "$remote_commit" = "$base_commit" ]; then
            remote_status="ahead"
        else
            remote_status="diverged"
        fi

        # Output the repo name with its status
        printf "%-30s | Local: %-8s | Remote: %s\n" "$base_repo_dir" "$local_status" "$remote_status"
    else
        # Report that this directory is not a git repository.
        printf "%-30s | Not a git repo\n" "$base_repo_dir"
    fi
done
