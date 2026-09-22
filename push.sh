#!/bin/bash
# Usage: ./push.sh "commit message"
if [ -z "$1" ]; then
  echo "Usage: ./push.sh \"your commit message\""
  exit 1
fi
git add -A
git commit -m "$1"
git push
