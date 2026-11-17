# Security and privacy

- This project has **no authentication, server-side CV database, Supabase integration or API keys**.
- Drafts are saved with `localStorage` on your device. Browser extensions, other people with access to your browser, or cleared browser data may affect privacy or persistence.
- Shared URLs carry a compressed snapshot of CV content in a URL fragment. The fragment is normally excluded from HTTP requests, but the complete URL can appear in copies, screenshots, chat history, bookmarks or browser history.
- **Anyone with a complete sharing link can view the included CV. There is no central way to revoke a shared link.**
- Phone and reference fields are omitted from links unless explicitly enabled. Email, education, and other visible CV sections are included by default.
- Avoid putting passwords, IDs or confidential information in a CV. This is a client-side editor, not encrypted storage.
- Example data under `lib/cv.ts` is fictional. Do not commit personal resume data or screenshots of real applicants to this public repository.
- To report a security issue, contact repository maintainers privately rather than posting sensitive details in a public issue.

**Historical commits:** Replacing files does not remove past Git history. If a previous version contained personal data, clean the repository history separately and remove any backup branches/tags that retain it.
