# Arni Photography

Cinematic portfolio & CMS for **Arni Photography**, Visakhapatnam — Next.js 16 (App Router), Turso (libSQL) + Drizzle ORM, Cloudinary media, and a JWT-protected admin panel.

## Getting started

```bash
npm install
cp .env.example .env      # fill in values
npm run db:migrate        # apply schema migrations
npm run db:seed           # create the admin user (admin / admin123 locally)
npm run dev               # http://localhost:3000
```

Admin panel: `http://localhost:3000/admin` (username `admin`, password `admin123`).

## Environment variables

See `.env.example`. The critical ones:

| Variable | Required | Notes |
| --- | --- | --- |
| `TURSO_DATABASE_URL` | Production | `libsql://...` from Turso |
| `TURSO_AUTH_TOKEN` | Production | Turso auth token |
| `JWT_SECRET` | Production | `openssl rand -base64 48`. The app **refuses to start in production** with a missing/weak value. |
| `CLOUDINARY_CLOUD_NAME` / `_API_KEY` / `_API_SECRET` | Production | Needed for admin media uploads |
| `NEXT_PUBLIC_SITE_URL` | Production | Canonical domain, no trailing slash, e.g. `https://arniphotography.in` |

## Database

```bash
npm run db:generate   # generate a migration from schema changes
npm run db:migrate    # apply pending migrations (idempotent, safe to re-run)
npm run db:seed       # create the admin user (uses ADMIN_USERNAME / ADMIN_PASSWORD)
npm run db:studio     # open Drizzle Studio
```

Migrations are tracked in a `__migrations` table. On a pre-existing database the script records a baseline instead of re-running, so it is safe to run before every deploy.

## Deploying (Vercel)

1. Push the repo to GitHub and import it in Vercel.
2. Add all env vars from `.env.example` in **Project → Settings → Environment Variables**.
3. Before the first deploy (or after any schema change), run migrations against the production Turso DB:

   ```bash
   TURSO_DATABASE_URL=... TURSO_AUTH_TOKEN=... npm run db:migrate
   ```

4. Create the admin user:

   ```bash
   TURSO_DATABASE_URL=... TURSO_AUTH_TOKEN=... ADMIN_PASSWORD=<strong-password> npm run db:seed
   ```

5. Deploy. The proxy (`proxy.ts`) protects `/admin/*` and the admin API routes; `/api/*` write routes are additionally rate-limited.

> The public site is fully static-rendered except for the admin routes and API, so a single Vercel deploy serves the whole site.

## Production checklist

- [ ] All env vars set, `JWT_SECRET` is a strong random string.
- [ ] Migrations run against the production database.
- [ ] Admin user created with a strong password (never `admin123` in production).
- [ ] **Host the showreel videos externally** — the homepage, films and editorial pages reference `/videos/*`. These files are intentionally git-ignored (`public/videos/`). Upload them to a CDN / S3 / object storage **preserving the same path structure** (e.g. `/videos/films/v1.mp4`), then set `VIDEO_CDN_URL` (see `.env.example`). In production, `next.config.ts` rewrites every `/videos/*` request to `<VIDEO_CDN_URL>/<path>`. Locally, the real files in `public/videos/` are served directly. No page code needs to change.
- [ ] Verify `/sitemap.xml` and `/robots.txt` render, and submit the sitemap in Google Search Console.
- [ ] Claim / verify the Google Business Profile (Arni Photography, Dutt Island, Siripuram) — the site's LocalBusiness schema and contact-page map embed use the same location and coordinates (`17.7238354, 83.318415`).
