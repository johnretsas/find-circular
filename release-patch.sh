#!/bin/bash
set -e

# Commit pending changes first (message required only when there are changes)
if [ -n "$(git status --porcelain)" ]; then
  if [ -z "$1" ]; then
    echo "Usage: ./release-patch.sh \"commit message\""
    exit 1
  fi
  git add -A
  git commit -m "$1"
fi

npm version patch
git push && git push --tags
