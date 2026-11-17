# Replace an existing GitHub repository

**Caution:** You requested removing the previous version. These instructions **delete the files on the default branch and replace them** with the current project; they do not delete Git history or a GitHub repository itself. Review the old repository first if it contains anything valuable.

## Before you start

1. Download and unzip the latest `academic-cv-builder` release package.
2. Confirm which repository you want to replace (for example: `https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git`).
3. Make sure you have permission to push changes to it, and that Git is authenticated on your computer (GitHub CLI / credential manager / SSH).
4. Check that you are allowed to push to the repository's default branch; branch protection may require a pull request.

## Recommended: use the safe replacement script

From the unzipped project root, run:

```bash
bash scripts/replace-existing-repo.sh https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
```

The script clones the destination into a fresh temporary directory, pushes a timestamped backup branch, prompts you to type `REPLACE`, removes all old branch files **except `.git`**, copies the current release, creates a commit and pushes the default branch. If authentication or branch protection blocks the push, nothing is deployed.

**Important:** GitHub's browser “Upload files” alone does not remove old files. Do not upload the ZIP itself as your application's sole repository file; upload its **contents** instead.

## GitHub About settings

Repository name: `academic-cv-builder`

Description:

> Open-source academic CV and portfolio builder for PhD students, researchers, and scholarship applicants. AI-assisted writing, PDF export, and shareable profiles.

Topics (up to GitHub's topic limit):

```text
academic-cv, resume-builder, phd, scholarship, researchers, portfolio, nextjs, supabase, vercel, open-source
```

Website field: add your **real Vercel production URL** after deploying. Do not use a guessed URL.

For GitHub search reach, keep the README screenshot, working demo URL, concise feature list, accurate topic tags, license, and a useful issue template.
