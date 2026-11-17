#!/usr/bin/env bash
set -euo pipefail

# Explicitly replaces all files in a GitHub repository's default branch.
# Only use after reviewing the destination. Previous files are backed up in a branch.

if [[ $# -ne 1 ]]; then
  echo "Usage: bash scripts/replace-existing-repo.sh https://github.com/OWNER/REPO.git" >&2
  exit 1
fi

REPO_URL="$1"
if [[ ! "$REPO_URL" =~ ^(https://github\.com/[^/]+/[^/]+(\.git)?|git@github\.com:[^/]+/[^/]+(\.git)?)$ ]]; then
  echo "For safety, provide a full GitHub repository URL (HTTPS or SSH)." >&2
  exit 1
fi

SOURCE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TEMP_DIR="$(mktemp -d)"
trap 'rm -rf "$TEMP_DIR"' EXIT

echo "Target: $REPO_URL"
git clone "$REPO_URL" "$TEMP_DIR/target"
cd "$TEMP_DIR/target"
BRANCH="$(git branch --show-current)"
if [[ -z "$BRANCH" ]]; then
  echo "No default branch found; aborting." >&2
  exit 1
fi

cat <<WARNING

WARNING: All files currently on '$BRANCH' of this repository will be
REPLACED by the Academic CV Studio release. Git history will remain.
The script will first push a backup branch to the remote.

WARNING
read -r -p "Type REPLACE to confirm: " CONFIRM
if [[ "$CONFIRM" != "REPLACE" ]]; then
  echo "Cancelled. Nothing changed."
  exit 0
fi

BACKUP="backup-before-cv-builder-$(date -u +%Y%m%d-%H%M%S)"
git branch "$BACKUP"
git push origin "$BACKUP"

# Work only inside the freshly cloned target, retaining its .git directory.
find . -mindepth 1 -maxdepth 1 ! -name '.git' -exec rm -rf -- {} +
cp -a "$SOURCE_DIR"/. .
rm -f .env .env.local

git add -A
if git diff --cached --quiet; then
  echo "Repository already matches the release; no new commit needed."
  exit 0
fi

git commit -m "Release Academic CV Studio v2.0 (no login)"
git push origin "$BRANCH"
echo "Uploaded to $REPO_URL (branch $BRANCH). Backup: $BACKUP"
