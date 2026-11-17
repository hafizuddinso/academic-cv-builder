# Deploy Academic CV Studio to Vercel (no database or account for visitors)

1. Fork or push the repository to GitHub.
2. Open https://vercel.com/new and import that GitHub repository.
3. Select **Next.js**; project root `.` and default build command `next build`.
4. **Do not add any environment variables.** No Supabase, API key or AI service is used.
5. Click **Deploy**. Vercel assigns a working `*.vercel.app` URL.
6. Test editing, browser auto-save, PDF export, JSON backup and link sharing.

Visitors to your deployment need **no account**. Only the site owner needs a Vercel account to deploy the application.

## Important limitations

- Local drafts stay in each visitor's browser and do not sync across devices.
- Links contain compressed CV snapshots, not remotely stored profile records. Very long profiles may create overly long URLs; save JSON when needed.
- Shared links are visible to anyone who receives the complete URL and cannot be revoked centrally.
- To test a shared link, create one, open it in a different private browser tab and verify it loads and prints.

Do not add credentials to the repository. Optional custom domain configuration happens in Vercel Project Settings.
