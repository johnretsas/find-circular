#!/bin/bash
set -e

if [ -z "$1" ]; then
  echo "Usage: ./release-minor.sh \"commit message\""
  exit 1
fi

git add -A
git commit -m "$1"
npm version minor
git push && git push --tags
