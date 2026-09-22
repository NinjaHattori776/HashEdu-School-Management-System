# Git Workflow — Pushing Changes to GitHub

## First-time setup (do this once)

```bash
cd ~/Desktop/Laravel/hashedu   # or wherever your project lives

git init
git add -A
git commit -m "Initial commit — HashEdu school management system"

# Create an empty repo on github.com first (no README/gitignore, since you already have them), then:
git remote add origin https://github.com/<your-username>/hashedu.git
git branch -M main
git push -u origin main
```

If prompted for credentials and you have 2FA enabled on GitHub, you'll need a
Personal Access Token instead of your password — generate one at
GitHub → Settings → Developer settings → Personal access tokens, and use it
as the password when Git prompts you.

## Every time you make changes — one command

A small script makes future commits a single command instead of three. Save
this as `push.sh` in your project root:

```bash
#!/bin/bash
# Usage: ./push.sh "commit message"
if [ -z "$1" ]; then
  echo "Usage: ./push.sh \"your commit message\""
  exit 1
fi
git add -A
git commit -m "$1"
git push
```

Make it executable once:
```bash
chmod +x push.sh
```

Then every future change is just:
```bash
./push.sh "Added fee payment tracking"
```

This stages every changed file, commits with your message, and pushes to
GitHub in one line — exactly the "single push showing the changes" workflow
you wanted.

## Checking what changed before committing (optional but good habit)

```bash
git status          # what files changed
git diff             # exact line-by-line changes
```

## A sensible .gitignore is already included

The `.gitignore` in this project already excludes `vendor/`, `node_modules/`,
`.env`, build output, and uploaded avatar files — none of that should ever be
committed. If `git status` ever shows `vendor/` or `node_modules/` as
"changes to be committed," something's wrong with your `.gitignore` — check
it hasn't been accidentally modified.

## Branching (optional, for when you want to try something risky)

```bash
git checkout -b feature/new-thing   # create and switch to a new branch
# ... make changes, commit as usual ...
git push -u origin feature/new-thing
# then open a Pull Request on GitHub to merge it into main when ready
```

For a solo project, working directly on `main` with the `push.sh` script
above is perfectly fine — branches matter more once other people are
contributing too.
