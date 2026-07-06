# Restaurant Visits — Reporting & Analytics Dashboard


A two-piece app:

- **`/server`** — Node/Express API that runs SQL directly against your **live MySQL**
  database (the one created by `createDB_PractI_AhnD.R` / `loadDB_PractI_AhnD.R`).
- **`/client`** — React (Vite) dashboard that calls that API and renders the charts.

No mock data anywhere — every number on screen comes from a live query.

---

## 0. Before anything else: rotate that password

`configBusinessLogic_PractI_AhnD.R` has your live Aiven MySQL password sitting in
plaintext (`db_password <- "..."`). If that file is ever pushed to GitHub for
submission, the credential is exposed. Two cheap fixes:

1. Move the connection details into `.env` (same pattern this dashboard uses)
   and add `.env` to `.gitignore` in every project that touches this DB.
2. Since the password has already been typed out once, rotate it from the
   Aiven console before you submit/share anything — costs nothing, avoids a
   real exposure.

## 1. One-time setup

### Server

```bash
cd server
npm install
cp .env.example .env
```

`.env.example` is already pre-filled with your real Aiven host/port/user
(`mysql-practicum1-cs5200-practicum1-ahnd.j.aivencloud.com`, port `25697`,
user `avnadmin`) — you only need to add the password, **in your own local
`.env`, never in a committed file.**

Your DB is Aiven-hosted, which requires SSL. Download the cluster's CA
certificate from the Aiven console (or reuse the `ca.pem` your R scripts
already point at) and drop it at `server/ca.pem` — or update `DB_SSL_CA` in
`.env` to wherever you keep it.

### Client

```bash
cd client
npm install
cp .env.example .env
```

Leave `VITE_API_URL=http://localhost:4000/api` unless you change the API's port.

---

## 2. Run it

Two terminals:

```bash
# Terminal 1
cd server
npm start
# -> Restaurant dashboard API listening on http://localhost:4000

# Terminal 2
cd client
npm run dev
# -> Local: http://localhost:5173
```

Open `http://localhost:5173`. If the header pill says **"DB connected"**, you're
live. If it says **"Connection failed"**, check the error text — it's almost
always a wrong password/host in `server/.env`, or MySQL not running.

---

## 3. What each screen shows (and where it maps to the assignment)

|  |  |
|---|---|
| Total visits per restaurant | Restaurant ticket cards, "Visits" row |
| Total (revenue) per restaurant | Restaurant ticket cards, "Revenue" row |
| Totals per month/year | "Visits & revenue by month" trend chart |
| Unique customers per restaurant + overall | Ticket cards ("Unique customers") + KPI strip top-of-page |
| Food vs. alcohol totals | KPI strip + donut chart |
| Extra metrics (added for creativity) | Avg party size/wait time/discount % and alcohol attach rate per restaurant (on each ticket card); payment-method mix; meal-type (daypart) mix; top-10 servers by tips; loyalty-member vs. non-member comparison |

### API endpoints (if you want to inspect raw JSON or reuse them elsewhere)

```
GET /api/health            connectivity check
GET /api/overview          headline totals (visits, revenue, food/alcohol, customers)
GET /api/restaurants       per-restaurant breakdown
GET /api/monthly           visits & revenue grouped by year/month
GET /api/payment-methods   visits & revenue by payment method
GET /api/meal-types        visits & avg party size by meal type
GET /api/servers/top       top 10 servers by total tips
GET /api/loyalty           loyalty-member vs non-member visits/revenue
```

All SQL lives in `server/src/routes/stats.js` — every query is a plain, readable
JOIN against your `restaurant / server / customer / meal_type / payment_method /
server_assignment / visit` schema, no ORM magic to explain away in the viva.

---

## 4. Deploying it (optional — "ideally hosted on the web")

Your MySQL is already cloud-hosted on Aiven, which means the hard part of
"hosted on the web" is done — you just need the API and client somewhere
that can reach it:

- **API**: any Node host (Render, Railway, Fly.io, a university VM) — set the
  same env vars from `.env.example` (with your real password) in that host's
  secrets manager, and upload `ca.pem` alongside the app or set `DB_SSL_CA`
  to wherever the host lets you store it.
- **Client**: `npm run build` in `/client` produces a static `dist/` folder
  for Netlify, Vercel, GitHub Pages, etc. Set `VITE_API_URL` at build time to
  your deployed API's URL.

If you stay local for the viva: just keep both `npm start` (server) and
`npm run dev` (client) running, and demo at `http://localhost:5173`. Either
way you're hitting the same live Aiven database — there's no offline/demo
mode in this app.

---

## 5. Troubleshooting

- **CORS error in the browser console** → make sure `CORS_ORIGIN` in
  `server/.env` matches the URL the client is actually running on
  (default `http://localhost:5173`).
- **`ECONNREFUSED` / `Connection failed` pill** → MySQL isn't running, or
  `DB_HOST`/`DB_PORT` are wrong.
- **`ER_ACCESS_DENIED_ERROR`** → `DB_USER`/`DB_PASSWORD` wrong, or that user
  doesn't have privileges on `DB_NAME`.
- **Charts render but look empty** → your `visit.visit_date` values are NULL
  for those rows (the monthly trend query filters those out by design).
