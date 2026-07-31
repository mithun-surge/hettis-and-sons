# Deployed on Railway

**Live URLs** (project: Surge Hackathon, environment: Mithun):
- CMS admin: https://cms-mithun.up.railway.app/admin (log in with your existing local admin credentials — the account was migrated)
- CMS API: https://cms-mithun.up.railway.app/api
- Site: https://web-mithun.up.railway.app

Architecture: **Strapi (CMS) runs only on Railway**, backed by **Railway Postgres** (`Postgres-9ig6` — the single database; local Postgres is no longer used). Uploaded media lives on a **Railway Volume** attached to the CMS service. Both local Astro dev (`web/.env` → `PUBLIC_STRAPI_URL`) and the deployed Astro site point at the same live Railway CMS, so there is exactly one CMS and one set of images. **Edit content only through the Railway-hosted Strapi admin panel** — do not run Strapi locally against a separate database.

## How each service is configured

Both services were created with `railway add --repo mithun-surge/hettis-and-sons --branch main` and configured via `railway api` (GraphQL) since some settings aren't exposed by simpler CLI commands:

**cms**
- Root directory: `cms`
- Build: `npm install && npm run build`
- Start: `npm run start`
- Volume `cms-volume` mounted at `/app/public` (not `/app/public/uploads` — see note below), size 50GB cap
- Domain: `cms-mithun.up.railway.app`, target port 1337
- Variables: `NODE_ENV=production`, `PORT=1337`, `HOST=::`, `DATABASE_CLIENT=postgres`, `DATABASE_URL=${{Postgres-9ig6.DATABASE_URL}}`, `DATABASE_SSL=false`, `PUBLIC_URL`, `CORS_ORIGINS` (includes both the web domain and `http://localhost:4321`), and the same `APP_KEYS`/`JWT_SECRET`/`API_TOKEN_SALT`/`ADMIN_JWT_SECRET`/`TRANSFER_TOKEN_SALT`/`ENCRYPTION_KEY` as the original local `.env` (kept identical so the migrated admin session/data stays valid — never regenerate these).

**web**
- Root directory: `web`
- Build: `npm install && npm run build`
- Start: `node ./dist/server/entry.mjs`
- Domain: `web-mithun.up.railway.app`, target port 4321
- Variables: `NODE_ENV=production`, `PORT=4321`, `HOST=::`, `PUBLIC_STRAPI_URL=https://cms-mithun.up.railway.app`

**Why `HOST=::` and explicit `PORT`**: Railway's edge proxy on this project's infrastructure needed the app listening on the IPv6 any-address and a `PORT` matching the domain's configured target port — without both, requests reached the edge fine (confirmed via `railway logs --network`) but got a 502 rather than being proxied through.

**Why the volume mounts at `/app/public` and not `/app/public/uploads`**: `railway volume files upload <dir> <remote>` always nests the upload under the source folder's basename (uploading `cms/public/uploads` to `/` lands files at `/uploads/...` on the volume, not at `/`). Rather than fight that, the volume's mount path was set to `/app/public` so the nested `/uploads` folder resolves to exactly where Strapi's local upload provider expects it (`public/uploads/`).

## Migrating data (already done once)

The original local database + uploaded files were migrated into Railway with:
```powershell
# dump local DB
& "C:\Program Files\PostgreSQL\18\bin\pg_dump.exe" -h 127.0.0.1 -p 5432 -U mithun -d postgres -F p --no-owner --no-privileges -f dump.sql

# wipe Railway's DB (it had auto-seeded itself with broken image-less placeholder content on first boot)
psql -h hayabusa.proxy.rlwy.net -p 35333 -U postgres -d railway -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"

# restore
psql -h hayabusa.proxy.rlwy.net -p 35333 -U postgres -d railway -f dump.sql

# upload the actual image files onto the volume
railway volume --service cms --volume <volume-id> files upload "cms\public\uploads" "/" --overwrite
```
Railway's Postgres public connection details (host/port/password) are visible in the `Postgres-9ig6` service's Variables tab (`DATABASE_PUBLIC_URL`) if this ever needs to be redone.

## Deploying changes going forward

Auto-deploy on `git push` to `main` is enabled on both services (Settings → Source shows the repo connected with "Auto deploys when pushed to GitHub"). Earlier in setup this connection was broken ("GitHub Repo not found") and both services had to be deployed manually with `railway up --service <cms|web>` from inside that service's folder — that resolved itself, but **if a future push doesn't trigger a deploy, fall back to `railway up`** from the relevant folder rather than waiting.

## Known trade-off

Local dev and production now share one database. Destructive local habits used during development (`TRUNCATE`-and-reseed to test schema changes) must never be run against this shared database — any future Strapi schema change needs a real migration plan, not a wipe-and-reseed.
