#!/bin/bash
export GIT_MERGE_AUTOEDIT=no
branches=("main" "backup-admin-module" "feature/admin-module" "feature/auth-module" "feature/forum-module" "feature/mentor-module" "feature/messagerie-module" "feature/student-module")

for branch in "${branches[@]}"; do
  echo "=========================================="
  echo "Updating branch: $branch"
  git checkout $branch || continue
  git pull origin $branch || true
  if git merge develop -m "chore: update from develop"; then
    git push origin $branch || git push --set-upstream origin $branch
  else
    echo "MERGE CONFLICT on $branch. Aborting merge."
    git merge --abort
  fi
done
git checkout develop
