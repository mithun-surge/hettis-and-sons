# Deploying to Railway

Architecture: **Strapi (CMS) runs only on Railway**, backed by **Railway Postgres** (the single database — no separate local DB after migration), with a **Railway Volume** so uploaded media persists. The **Astro site** runs both locally (dev) and on Railway (production) — both always point at the same live Railway Strapi URL, so there is exactly one CMS and one set of images, edited only through the Railway-hosted Strapi admin panel from now on.

## 0. One-time local tooling (already done on this machine)
`git`, `gh` (GitHub CLI), and `railway` (Railway CLI) are installed via winget/npm.

## 1. You: log in (interactive — must be done by you, not automatable)
Run these yourself in a terminal (VS Code's terminal is fine):
```powershell
gh auth login
railway login
```
`gh auth login` opens a browser to authorize the CLI against your GitHub account (`mithun-surge`). `railway login` does the same for your Railway account. Once both say "Logged in as ...", let me know and I'll continue.

Then link this local checkout to your existing Railway project:
```powershell
cd "C:\Users\Mithun Hettige\Desktop\Hackathon Project"
railway link
# select project: the one at
# https://railway.com/project/4a7da534-609f-4304-a70a-c3803902ae7a
```

## 2. GitHub repo
Once logged in, I'll run:
```powershell
gh repo create mithun-surge/hettis-and-sons --public --source=. --remote=origin --push
```
This creates the repo, adds it as `origin`, and pushes the `main` branch with the initial commit already made.

## 3. Railway services (dashboard steps)
In the existing Railway project/environment:

1. **Postgres** — if not already provisioned in that project, add a Postgres database plugin from the Railway dashboard ("+ New" → Database → PostgreSQL).
2. **CMS service** — "+ New" → GitHub Repo → select `hettis-and-sons` → after creation, in Settings:
   - **Root Directory**: `cms`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run start`
   - **Volume**: attach a Volume, mount path `/app/public/uploads` (persists uploaded media across deploys — without this, every redeploy wipes all images)
   - **Variables** (copy these from your current local `cms/.env` so the migrated database's existing admin user/sessions stay valid — do not regenerate them):
     ```
     NODE_ENV=production
     DATABASE_CLIENT=postgres
     DATABASE_URL=${{Postgres.DATABASE_URL}}
     DATABASE_SSL=false
     APP_KEYS=yg7/k3O7B9FeXhIbPsj8HQ==,g8ShzF7n1UM+CNFzv/IXQQ==,JS72AKTy/ESxehZO7N3f+g==,skk6YNvLeiUGOtcQBuoWtA==
     API_TOKEN_SALT=sG4KJLQXVFXKGZLmrwu2ww==
     ADMIN_JWT_SECRET=if11fHkSueWiT7jhsad5SA==
     JWT_SECRET=d0mE86wMooUy7ITVZbOB7g==
     TRANSFER_TOKEN_SALT=ltn/U6cMPNnVhEbinwamZg==
     ENCRYPTION_KEY=8h9RbgP6dN4zHDtFy0bD2A==
     CORS_ORIGINS=http://localhost:4321,https://<web-service-domain>.up.railway.app
     ```
     (`${{Postgres.DATABASE_URL}}` is Railway's reference-variable syntax — it auto-fills from the Postgres plugin, no need to type a real connection string.)
   - After first deploy, go to Settings → Networking → **Generate Domain** to get its public URL, then set `PUBLIC_URL=https://<that-domain>` as an additional variable and redeploy.
3. **Web service** — "+ New" → GitHub Repo → same repo again → Settings:
   - **Root Directory**: `web`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `node ./dist/server/entry.mjs`
   - **Variables**:
     ```
     NODE_ENV=production
     PUBLIC_STRAPI_URL=https://<cms-service-domain>.up.railway.app
     ```
   - Generate its own public domain the same way, then go back and update the CMS service's `CORS_ORIGINS` to include it.

## 4. Migrate the existing local data (one-time)
Once the CMS service is deployed (even before content looks right), we point a one-time migration at Railway's Postgres:
1. Dump the local database: `pg_dump` the local `postgres` DB.
2. Restore it into Railway's Postgres (via `railway connect Postgres` or the connection string from the Postgres service's Variables tab).
3. Copy the local `cms/public/uploads/` folder's contents into the Railway Volume (via `railway run` / Railway's shell, or a one-off script) so the migrated database's image references resolve correctly.

I'll drive this step with you once the Postgres service exists and I have its connection details via `railway variables`.

## 5. Point local Astro dev at the live CMS
Update `web/.env`:
```
PUBLIC_STRAPI_URL=https://<cms-service-domain>.up.railway.app
```
From then on, `npm run dev` in `web/` talks to the same live Railway CMS as production — no local Strapi needed. Content edits happen only in the Railway Strapi admin panel at `https://<cms-service-domain>.up.railway.app/admin`.
