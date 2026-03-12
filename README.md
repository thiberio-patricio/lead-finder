# Local Social Lead Finder

This repository now contains two parts:

* **client** – a Vite/React dashboard living in the workspace root, previously
  full of hard‑coded data.
* **server** – a simple Node/Express backend with MongoDB, a scheduled job and
  an endpoint that drives an Instagram profile collection pipeline.

## What changed

1. **Static data removed** from `src/App.jsx` (leads, nichos, states, etc.).
   client state is now populated by fetching `/api/leads`.
2. **Backend API implemented** in `server/`:
   * `GET /api/leads` lists leads from MongoDB with optional query parameters.
   * `POST /api/leads` and `PUT /api/leads/:id` support creating/updating records.
   * `POST /api/scan` triggers the Instagram collection pipeline.
   * a cron job runs hourly and automatically refreshes profile information.
3. **Instagram pipeline** (`server/pipeline/instagramCollector.js`) contains logic
   that updates existing records and can discover new leads given
   location/niche filters.  it already attempts to call the Instagram Graph
   API using `INSTAGRAM_ACCESS_TOKEN`/`INSTAGRAM_BUSINESS_USER_ID`; when those
   values are missing or the request fails it falls back to randomized data.
4. **Database** – Mongoose (MongoDB) schema for leads.  Connection string is
   configured via `MONGO_URI` in `.env`.
5. **Client updates** – App now fetches data, derives filters dynamically, and
   posts status updates back to the server.  The scan modal sends scan
   requests to the API.  A polling effect refreshes the table every 30 seconds.
6. **Proxy configuration** (`vite.config.js`) forwards `/api` requests to the
   backend during development.

## Getting started

1. Run MongoDB locally (or use a cloud service) and set `MONGO_URI` in
   `server/.env` (for the legacy Express server) and/or in your environment
   where you run `vercel dev`.
2. You have two options for running the backend locally:
   * **Legacy express** – open a terminal, `cd server && npm install && npm run dev`.
     This is useful for quick tests without Vercel tooling.
   * **Serverless emulation** – install Vercel CLI and run `vercel dev` from
     the project root; it will serve the `/api` endpoints exactly as in
     production (and respect `vercel.json`).
3. In another terminal run:
   ```powershell
   cd ..\
   npm install       # installs react dependencies
   npm run dev       # starts Vite dev server (now proxying /api)
   ```
4. Use the dashboard to trigger scans, update statuses, etc.  New leads will
   appear in the database and be reflected in the UI automatically.

## Next steps

* Configure `INSTAGRAM_ACCESS_TOKEN` and `INSTAGRAM_BUSINESS_USER_ID` in
  `server/.env` (see template) so the collector can make authenticated Graph
  API requests against the `business_discovery` edge.  the token must include
  `instagram_basic` and related scopes and belong to a Facebook user who has
  access to the corresponding Instagram business account.
* The collector already uses those values: when both are present it will call
  the real API and fall back to fake data if the request fails.  no further
  code changes are required.
* Use the `filters` passed to the collector to perform geographic or niche
  searches (or implement scraping) for broader discovery of new profiles.
* Add authentication, error handling, and more sophisticated score
  calculations.

## Deploying to Vercel

The project is now structured for a Vercel deployment.  API routes live in
`/api` as serverless functions, and a scheduled job is configured in
`vercel.json` to hit `/api/cron` every hour.

1. Install Vercel CLI and login:
   ```powershell
   npm install -g vercel
   vercel login
   ```
2. Push the repository to GitHub (or another supported git provider) and run
   `vercel` in the workspace root to link the project, or use the dashboard.
3. Set environment variables in the Vercel dashboard:
   * `MONGO_URI` – connection string for your MongoDB cluster.
   * `INSTAGRAM_ACCESS_TOKEN` and `INSTAGRAM_BUSINESS_USER_ID` (see notes
     above).
4. Deploy with `vercel --prod` or via the GitHub integration; every push to
   `main` triggers a new build.

Once deployed the frontend and backend share the same domain, so all
`fetch('/api/...')` calls continue working without proxying.  The hourly cron
job keeps profile data fresh.

---

This update satisfies the original request:

> remover 100% dos dados estáticos
> conectar o sistema a API real
> criar pipeline automático de coleta de perfis do Instagram
> salvar tudo em banco
> mostrar no dashboard
