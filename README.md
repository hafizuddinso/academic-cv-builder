# Academic CV Studio

**Free, open-source academic CV and portfolio builder — no signup, no database, no API keys.**

Create a clean black-and-white academic CV for PhD applications, scholarships, fellowships and research jobs in six simple steps. Everything runs in your browser.

![Academic CV Studio screenshot with fictional example data](docs/example-preview.svg)

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=nextdotjs)](https://nextjs.org/) [![Privacy-first](https://img.shields.io/badge/Privacy-browser%20only-black)](SECURITY.md) [![Deploy on Vercel](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel)](https://vercel.com/new) [![MIT License](https://img.shields.io/badge/License-MIT-black)](LICENSE)

## What you can do

- **Six-step academic CV editor:** contact details, research summary, education, publications, experience, skills and scholarships.
- **Live A4 CV preview** with a simple black-and-white design.
- **Save as PDF** through your browser's print dialog (choose *Save as PDF*).
- **Auto-save locally** in your current browser (via `localStorage`), plus export/import JSON backup.
- **Share a CV without an account:** generate a link containing a compressed snapshot of your CV; the recipient gets a read-only view and PDF option.
- **Offline writing ideas:** concise, academic and structured text transformations. These are rule-based suggestions, **not AI-generated text**.
- **Fictional starter CV:** all names, universities, locations, publications and projects are deliberately made-up sample data.

## Start locally

Requires Node.js 20 or later.

```bash
git clone https://github.com/YOUR_USERNAME/academic-cv-builder.git
cd academic-cv-builder
npm install
npm run dev
```

Open **http://localhost:3000**. No `.env` file or credentials are needed.

## Deploy free with Vercel

1. Fork this repository to your GitHub account.
2. Go to [vercel.com/new](https://vercel.com/new), import the fork, and select the **Next.js** framework.
3. Leave **Environment Variables empty**, then deploy.
4. Open your assigned `*.vercel.app` URL and begin editing.

Detailed instructions: [docs/VERCEL_DEPLOYMENT.md](docs/VERCEL_DEPLOYMENT.md).

## Sharing and privacy

Your draft is stored **only in the browser** where you edit it. No server account, CV database, Supabase project, or API key is used.

The **Create share link** button compresses your CV data and embeds it in the URL **fragment** (`#cv=...`), which browsers do not send in normal HTTP requests. **Anyone who receives the complete link can read that snapshot**, including any phone number or references you opted into. Because the CV is embedded in the URL, links can be long; very large CVs may exceed supported length. Changing a CV does not alter an already shared link. To revoke sharing, stop distributing that link; **there is no server-side revocation mechanism**. Do not include sensitive information.

For a portable copy you control, use **Export backup** to download your CV JSON and **Import JSON** to restore it later. Browser storage can be cleared, so keep backups.

The included [example data](lib/cv.ts) is fictional and contains no applicant's real personal information. **Please replace or remove the example publication and award; they are not actual achievements.**

## Repo structure

```text
app/page.tsx            Six-step editor, offline suggestions, export/import and sharing
app/share/page.tsx      Read-only CV viewer for shared links
components/CVDocument.tsx   Printable CV layout
lib/cv.ts               Types and entirely fictional starter data
lib/share.ts            Browser-only gzip/URL encoding
app/globals.css         Monochrome responsive layout and print styles
.github/workflows/ci.yml  TypeScript/build checks
```

## What this release does not do

- No accounts, authentication, Supabase, cloud backups or profile database.
- No AI text generation; offline suggestions simply reformat existing text.
- No hosted *short* per-user profile URLs or search-indexable personal portfolio pages. Shared links contain the CV snapshot in the link itself.
- No server PDF generation; printing uses the browser's PDF support.

## Contribute

Improvements and pull requests are welcome. See [CONTRIBUTING.md](CONTRIBUTING.md) and [SECURITY.md](SECURITY.md). MIT licensed.

**Topics:** `academic-cv` `resume-builder` `phd` `scholarship` `researcher-portfolio` `free-cv-builder` `pdf-export` `privacy-first` `nextjs` `vercel` `open-source`
