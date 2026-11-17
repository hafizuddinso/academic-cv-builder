# Academic CV Studio

**Create a professional academic CV in six steps.** A minimal black-and-white, open-source CV builder for PhD applications, research positions, fellowships, and scholarships.

![Academic CV Studio — black-and-white CV editor](design-preview.png)

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=nextdotjs)](https://nextjs.org/) [![Supabase](https://img.shields.io/badge/Supabase-Postgres-black?logo=supabase)](https://supabase.com/) [![Deploy on Vercel](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel)](https://vercel.com/) [![MIT License](https://img.shields.io/badge/License-MIT-black)](LICENSE)

> **Status:** Version 1.1 preview release. Editing, local autosave and browser-based PDF export work without an account. Cloud sync, public pages and AI rewrites require configuration. The source has been checked for missing files; a complete `npm run build` has **not** been verified in this preparation environment because the npm registry was unreachable.

## Features

- **Six guided steps:** Identity & links → Research profile → Education → Research & publications → Experience & projects → Skills & awards.
- **Academic-first structure:** Thesis, supervisors, publications/DOIs, research interests, scholarships and training.
- **Live CV preview** with a monochrome layout designed for A4 printing.
- **Save as PDF** using your browser's **Print → Save as PDF** (not server-side PDF generation).
- **Automatic local drafts** even without Supabase, plus downloadable JSON backup.
- **Optional private Supabase drafts** protected by Row Level Security (RLS).
- **Optional public CV URL** at `/p/your-slug`. Nothing is published automatically.
- **Optional AI writing assistant** offering concise, academic and impact-focused rewrites. Requires a server API key and authorized login.
- **Privacy controls** for phone number and referee contacts; excluded by default.

## Preview

Open [`design-preview.html`](design-preview.html) locally to review a **static design mock-up**. For the functioning Next.js app, use the setup below.

## Quick start

Requirements: Node.js **20+**, npm.

```bash
git clone https://github.com/YOUR_USERNAME/academic-cv-builder.git
cd academic-cv-builder
npm install
npm run dev
```

Open **http://localhost:3000**. No environment variables are necessary for local editing, preview or browser PDF printing.

**This repository includes the author's CV as sample data** in [`lib/cv.ts`](lib/cv.ts). Replace the sample before distributing a customized fork. Phone and reference contact details are not included in source, but sample academic details and a public email are intentionally included. For a blank template, replace `starterCV` with your own information.

## Supabase: private drafts and published public pages

1. Create a [Supabase project](https://supabase.com/dashboard).
2. Open its **SQL Editor** and run [`supabase/schema.sql`](supabase/schema.sql).
3. The default configuration is **owner-only**: the SQL permits cloud editing only for `hafizuddin@upc.edu`. **Before running it**, replace this email if you are deploying your own copy.
4. Enable Supabase **Authentication → Email (OTP/magic link)** and add your development and production URLs in **Authentication → URL Configuration**.
5. Copy `.env.example` to `.env.local`; set the project URL and **publishable / anon key** (never the service role key).
6. Restart the app; log in with the authorized email; save a draft, then explicitly **Publish portfolio**.

Full walkthrough: [`docs/SUPABASE_SETUP.md`](docs/SUPABASE_SETUP.md).

### Environment variables

| Variable | Required? | Where used |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Cloud features | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Cloud features | Supabase publishable / anon key, protected by RLS |
| `NEXT_PUBLIC_SITE_URL` | Optional | Canonical public website URL (for sharing metadata) |
| `OPENAI_API_KEY` | AI only | **Server-side secret**; never expose to browser |
| `OPENAI_MODEL` | AI only | Chat completions model; default `gpt-4.1-mini` |
| `AI_ALLOWED_EMAIL` | AI only | Email authorized to spend AI API credits |

AI-generated wording is a **suggestion**, not fact verification. Check everything before publishing an academic CV.

## Deploy to Vercel

1. Push repository files to GitHub.
2. Import the repository in [Vercel](https://vercel.com/new), framework **Next.js**, root directory `.`.
3. Set the environment variables in **Project → Settings → Environment Variables**, then deploy/redeploy.
4. In Supabase Auth URL Configuration, add your actual `https://YOUR-PROJECT.vercel.app` address as the Site URL and an allowed Redirect URL.
5. Sign in, publish from the editor, and visit `https://YOUR-PROJECT.vercel.app/p/your-slug`.

A live URL **cannot be determined until you deploy**. More details: [`docs/VERCEL_DEPLOYMENT.md`](docs/VERCEL_DEPLOYMENT.md).

## Updating an existing GitHub repository

To fully replace all tracked files, use [`docs/REPLACE_EXISTING_REPO.md`](docs/REPLACE_EXISTING_REPO.md) or the confirmation-protected [`scripts/replace-existing-repo.sh`](scripts/replace-existing-repo.sh). **Back up your repository first**: ordinary GitHub “Upload files” does not automatically delete outdated files.

## Project structure

```text
app/page.tsx                 Six-step editor and publishing UI
app/p/[slug]/page.tsx        Public CV webpage
app/api/rewrite/route.ts     Restricted server-side AI rewriting
components/CVDocument.tsx   A4 printable academic CV
lib/cv.ts                   Data types and sample academic resume
lib/supabase.ts             Browser Supabase client
supabase/schema.sql         Tables, RLS and update triggers
docs/                       Supabase, Vercel and GitHub guides
.github/workflows/ci.yml    Build and type-check automation
```

## Roadmap

- [x] Six-step editor and live print preview
- [x] Local autosave and JSON backup
- [x] Supabase private drafts and opt-in published profiles
- [x] Optional AI rewrite variations
- [ ] Multiple CV templates and version history
- [ ] Direct generated PDF download without browser print
- [ ] Cover-letter builder
- [ ] Multi-user SaaS support (the included SQL is deliberately owner-only)

## Contributing and license

Issues, feedback, accessibility fixes and pull requests are welcome. See [CONTRIBUTING.md](CONTRIBUTING.md) and [SECURITY.md](SECURITY.md). Licensed under the [MIT License](LICENSE).

**Keywords:** academic CV · PhD resume · scholarship application · researcher portfolio · open-source resume builder · AI writing assistant · PDF export · Next.js · Supabase · Vercel.
