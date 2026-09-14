# MegaMasti — No Filter

A premium, anonymous, safety-first South Asian conversation platform.

## Local setup

1. Copy `.env.example` to `.env.local`.
2. Add the Supabase project URL and anon key.
3. Run `npm install` and `npm run dev`.

Without environment variables, the interface uses curated demo content.

## Production build

```bash
npm ci
npm run build
```

Deploy the generated `dist/` directory. The included `public/.htaccess` enables SPA routing on Hostinger Apache hosting.

## Database

Run `supabase/schema.sql` in the linked Supabase project before enabling production submissions.
