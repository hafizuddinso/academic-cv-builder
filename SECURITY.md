# Security and privacy

- Never commit `.env.local`, OpenAI keys, Supabase `service_role` keys or access tokens.
- Use Supabase's **publishable / anon** key in the browser and keep **Row Level Security enabled**.
- The provided schema is owner-only by default; change the owner email if you fork.
- Unpublished CV drafts are private. Public CV snapshots are visible to anyone with the link.
- Users must explicitly enable phone and reference visibility before publishing them.
- The author-supplied starter CV contains deliberately public academic details. Remove them before reusing the template as another person's portfolio.

To report a vulnerability, contact the repository maintainer privately rather than opening a public issue that discloses exploitable details.
