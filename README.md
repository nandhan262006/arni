# Arni Photography

Cinematic portfolio & CMS for **Arni Photography**, Visakhapatnam — Next.js 16 (App Router), Turso (libSQL) + Prisma ORM, Cloudflare R2 media, and a JWT-protected admin panel.

## Getting started

```bash
npm install                 # runs prisma generate
cp .env.example .env        # fill in values
npm run db:seed             # create the admin user (admin / admin123 locally)
npm run dev                 # http://localhost:3000
```

Admin panel: `http://localhost:3000/admin` (password `admin123`).

## Environment variables

See `.env.example`. The critical ones:

| Variable | Required | Notes |
| --- | --- | --- |
| `TURSO_DATABASE_URL` | Production | `libsql://...` from Turso |
| `TURSO_AUTH_TOKEN` | Production | Turso auth token |
| `JWT_SECRET` | Production | `openssl rand -base64 48`. The app **refuses to start in production** with a missing/weak value. |
| `R2_ACCOUNT_ID` / `R2_ACCESS_KEY_ID` / `R2_SECRET_ACCESS_KEY` | Production | Cloudflare R2 credentials (Manage R2 API Tokens). Used for admin media uploads |
| `R2_BUCKET_NAME` | Production | R2 bucket, e.g. `arni-media` |
| `R2_PUBLIC_URL` | Production | Public URL that serves the bucket (custom domain or `*.r2.dev`), no trailing slash |
| `NEXT_PUBLIC_SITE_URL` | Production | Canonical domain, no trailing slash, e.g. `https://arniphotography.in` |

## Database (Turso + Prisma)

The Prisma schema in `prisma/schema.prisma` is the source of truth. Prisma Client connects to Turso through the libSQL driver adapter (`@prisma/adapter-libsql`); the connection comes from `TURSO_DATABASE_URL` / `TURSO_AUTH_TOKEN` (falls back to a local `file:./local.db` for offline development).

```bash
npm run db:generate   # regenerate the Prisma Client after schema changes
npm run db:push       # push schema changes to the database (Turso by default)
npm run db:migrate    # apply committed migration files (see below)
npm run db:seed       # create the admin user (uses ADMIN_USERNAME / ADMIN_PASSWORD)
npm run db:studio     # open Prisma Studio
```

**Important:** Prisma Migrate cannot reach Turso over HTTP — it only connects to local SQLite files (`file:`). The repo ships a baseline migration (`prisma/migrations/20260812053327_init`) that mirrors the current schema:

- **Existing Turso database** — the schema is already deployed. Nothing to run. (`npm run db:migrate` is a safe no-op: the baseline is marked as applied on the existing DB.)
- **Fresh database** — run `npm run db:migrate` and it will create all tables, then `npm run db:seed`.

When you change `schema.prisma` in the future:

1. Generate and test the migration against a **local** SQLite file:

   ```bash
   TURSO_DATABASE_URL="file:./local.db" npx prisma migrate dev --name describe_change
   ```

   This creates `prisma/migrations/<timestamp>_describe_change/migration.sql`.

2. Apply that SQL to the production Turso database:

   ```bash
   turso db shell <db-name> < prisma/migrations/<timestamp>_describe_change/migration.sql
   ```

3. Mark the migration as applied so future `npm run db:migrate` calls stay consistent:

   ```bash
   TURSO_DATABASE_URL="file:./local.db" npx prisma migrate resolve --applied <timestamp>_describe_change
   ```

   Commit the generated `prisma/migrations` folder. Do not run Prisma migrate commands against the `libsql://` URL — use `turso db shell` to apply SQL instead.

## Cloudflare R2 (images & videos)

Gallery images and films are uploaded through the admin panel. The `/api/upload` route (auth required) issues a short-lived presigned PUT URL against your R2 bucket; the browser uploads directly to R2, and the resulting public URL is stored in the database. Deleting a gallery image/film also removes the object from R2.

- Create a bucket in the Cloudflare dashboard (R2 → Create bucket), e.g. `arni-media`.
- Create an access key under **R2 → Manage R2 API Tokens**.
- Set `R2_PUBLIC_URL` to a custom domain connected to the bucket (recommended, gives you clean URLs and lets `next/image` optimize) or to the bucket's `*.r2.dev` domain.
- Add `R2_PUBLIC_URL`'s hostname is picked up automatically by `next.config.ts` for `next/image`.

## Deploying (Vercel)

1. Push the repo to GitHub and import it in Vercel.
2. Add all env vars from `.env.example` in **Project → Settings → Environment Variables**.
3. Create the admin user:

   ```bash
   TURSO_DATABASE_URL=... TURSO_AUTH_TOKEN=... ADMIN_PASSWORD=<strong-password> npm run db:seed
   ```

4. Deploy. The proxy (`proxy.ts`) protects `/admin/*` and the admin API routes, and every admin route additionally enforces auth itself. Public contact submissions and `/api/public/*` remain open (rate-limited).

> The public site is fully static-rendered except for the admin routes and API, so a single Vercel deploy serves the whole site.

## Production checklist

- [ ] All env vars set, `JWT_SECRET` is a strong random string.
- [ ] R2 bucket + API token created, `R2_PUBLIC_URL` set to your custom domain.
- [ ] Admin user created with a strong password (never `admin123` in production).
- [ ] **Host the showreel videos externally** — the homepage, films and editorial pages reference `/videos/*`. These files are intentionally git-ignored (`public/videos/`). Upload them to a CDN / S3 / object storage **preserving the same path structure** (e.g. `/videos/films/v1.mp4`), then set `VIDEO_CDN_URL` (see `.env.example`). In production, `next.config.ts` rewrites every `/videos/*` request to `<VIDEO_CDN_URL>/<path>`. Locally, the real files in `public/videos/` are served directly. No page code needs to change.
- [ ] Verify `/sitemap.xml` and `/robots.txt` render, and submit the sitemap in Google Search Console.
- [ ] Claim / verify the Google Business Profile (Arni Photography, Dutt Island, Siripuram) — the site's LocalBusiness schema and contact-page map embed use the same location and coordinates (`17.7238354, 83.318415`).
