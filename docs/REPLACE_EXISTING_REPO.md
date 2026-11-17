# Replacing a previous release

`main` should contain the actual Next.js files, not a ZIP archive. Use the safe replacement script if you need to upload this release to another repository:

```bash
bash scripts/replace-existing-repo.sh https://github.com/YOUR_USERNAME/academic-cv-builder.git
```

The script creates a backup branch and then replaces tracked files. **Backups and Git history may contain data from older releases.** If you are removing previously committed personal details, ordinary deletion does not scrub the old commits; use a separate Git history-cleaning procedure and delete stale backup refs.

## GitHub About settings

- **Repository name:** `academic-cv-builder`
- **Description:** `Free open-source academic CV builder for PhD students, researchers and scholarship applicants. No login, PDF export and shareable profiles.`
- **Topics:** `academic-cv`, `resume-builder`, `phd`, `scholarship`, `researcher-portfolio`, `free-cv-builder`, `pdf-export`, `privacy-first`, `nextjs`, `vercel`, `open-source`
- **Homepage:** enter your real Vercel URL after deploying.
