# Connect Supabase

Supabase is **optional**. The editor still works with local autosave and print-to-PDF when no environment variables are supplied.

## 1. Database

Create a Supabase project and open **SQL Editor → New query**. Paste and run [`../supabase/schema.sql`](../supabase/schema.sql).

**Before running:** Search the SQL for `hafizuddin@upc.edu`. It is the configured **owner email** for this personal CV website. Replace it with your own login email if necessary. The SQL uses `auth.uid()` + the owner email to restrict saving, publishing and unpublished profile access. Visitors can read *only* intentionally published profiles.

The script uses `drop policy if exists` so it can be rerun safely for policy changes. It does not delete your CV data. If you alter the access model, audit all RLS rules.

## 2. Authentication

In **Authentication → Providers**, ensure **Email** sign-in is enabled; magic-link/OTP configuration may depend on your Supabase project settings. In **Authentication → URL Configuration**:

- Site URL: set your actual Vercel deployment URL when you have it, or `http://localhost:3000` for development.
- Redirect URLs: include `http://localhost:3000/**` and `https://YOUR-APP.vercel.app/**` (replace placeholder with your real domain). Supabase redirect wildcard rules apply.

Sign in with the **same email** used in the RLS owner rule. If sign-in succeeds but saving returns an RLS error, verify the email matches and the SQL ran successfully.

## 3. Environment variables

Copy `.env.example` to `.env.local`, then configure:

```dotenv
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_PUBLISHABLE_OR_ANON_KEY
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Find the project URL and publishable key in **Project Settings → API Keys / Data API** (labels may vary). Do **not** put a `service_role` or secret key in `NEXT_PUBLIC_` variables.

Restart the Next.js server after modifying environment variables. Add the same values in **Vercel → Project → Settings → Environment Variables** for deployment.

## 4. Save & publish

- Complete or edit your CV; it is saved in browser storage automatically.
- Sign in; press **Save draft** on the final screen to copy it to the private `cv_drafts` table.
- Set your public URL slug, then press **Publish portfolio**.
- Publishing creates a separate snapshot in `cv_profiles`; later edits stay private until you publish again.
- Use **Unpublish** to remove the public page. The private draft remains available.

A published CV contains its email and other visible academic details. Phone and reference contacts are excluded unless explicitly enabled. Public links can be indexed or shared by anyone who knows the URL.

## 5. Optional AI assistant

Set these server-only environment variables in `.env.local` and Vercel:

```dotenv
OPENAI_API_KEY=YOUR_SERVER_SECRET
OPENAI_MODEL=gpt-4.1-mini
AI_ALLOWED_EMAIL=YOUR_AUTHORIZED_SIGN_IN_EMAIL
```

The AI API route authenticates the Supabase access token and checks `AI_ALLOWED_EMAIL`. Do **not** grant untrusted users unlimited access to a paid API key. Validate suggested wording before placing it in a CV.

## Troubleshooting

- **Sign-in redirect fails:** check Site URL and Redirect URLs in Supabase.
- **Permission denied / RLS:** check that the login email matches the SQL owner email, and RLS policies were created.
- **Public page gives 404:** confirm the profile is published, the slug matches, and the deployment has the public URL/key variables.
- **AI shows “not configured”:** check the server API key, `AI_ALLOWED_EMAIL`, Supabase values, and your app redeploy.
- **No cloud access:** local editing and browser print still work.
