# Deploy on Vercel

1. Publish the source repository on GitHub. Do not commit `.env.local`, service-role keys, or OpenAI API keys.
2. Open [Vercel → Add New Project](https://vercel.com/new) and import the repository.
3. Use **Framework Preset: Next.js**, **Root Directory: `.`** and the default build command (`next build`).
4. Add the `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` variables to your Vercel project's **Settings → Environment Variables** to enable cloud saving/public CV links. Add `OPENAI_API_KEY`, `OPENAI_MODEL`, and `AI_ALLOWED_EMAIL` only if enabling AI.
5. Set `NEXT_PUBLIC_SITE_URL=https://YOUR-PROJECT.vercel.app` once Vercel has assigned your actual domain. Redeploy so the setting takes effect.
6. In Supabase Authentication URL Configuration, allow your real Vercel deployment URL.
7. Visit your deployed editor, sign in, publish, and share `https://YOUR-PROJECT.vercel.app/p/YOUR-SLUG`.

Vercel will show you the actual URL after the first successful deployment. This project does not include an already-created Vercel website.

### Verify after deployment

- Editor loads without configuration errors.
- All six sections open and accept edits.
- Print preview and **Save as PDF** work.
- Supabase email sign-in works for your configured owner account.
- Save draft, publish, unpublish, and public link work.
- Your OpenAI key is never present in `NEXT_PUBLIC_` settings or committed files.

The `/p/[slug]` page queries public profile data with Supabase's publishable key, subject to the database's Row Level Security.
