# Deployment Guide — DIL & DATA

## Architecture

| Layer | Host | Notes |
|-------|------|--------|
| Client | **Vercel** | Vite React SPA |
| API | **Render** (or Railway) | Express + Node |
| Database | **MongoDB Atlas** | Cluster + IP allowlist |
| Media | **Cloudinary** | Images, video, PDFs |

Custom domain: point DNS to Vercel for the site; API can live on `api.yourdomain.com` or Render's subdomain.

---

## 1. MongoDB Atlas

1. Create a cluster and database user.
2. Network Access → allow `0.0.0.0/0` (or Render IPs).
3. Copy the connection string into `MONGODB_URI`.

---

## 2. Cloudinary

1. Create a Cloudinary account.
2. Copy Cloud name, API Key, API Secret into the API env.
3. Optional: set `CLOUDINARY_FOLDER=dil-and-data`.

---

## 3. API (Render)

1. New **Web Service** from the `server/` folder (or monorepo root with root dir `server`).
2. Build: `npm install`
3. Start: `npm start`
4. Environment variables (see `server/.env.example`):

```
NODE_ENV=production
PORT=10000
CLIENT_URL=https://YOUR-VERCEL-DOMAIN
MONGODB_URI=...
JWT_SECRET=<long random string>
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
API_PUBLIC_URL=https://YOUR-RENDER-SERVICE.onrender.com/api
```

5. After first deploy, open a Render shell (or local with prod URI) and run:

```bash
npm run seed:admin
npm run seed:pages
```

6. Health check: `GET https://YOUR-API/api/health`

---

## 4. Client (Vercel)

1. Import the repo; set **Root Directory** to `client`.
2. Framework: Vite.
3. Environment:

```
VITE_API_URL=https://YOUR-RENDER-SERVICE.onrender.com/api
```

4. Deploy. Update API `CLIENT_URL` to the Vercel URL (and `CLIENT_URLS` if you use preview deployments).

---

## 5. Custom domain

1. Add domain in Vercel → follow DNS instructions.
2. Set Studio → SEO → canonical base to `https://yourdomain.com`.
3. Optionally map `api.yourdomain.com` to Render and set `API_PUBLIC_URL` accordingly.

---

## 6. Production checklist

- [ ] Strong unique `JWT_SECRET`
- [ ] `ALLOW_REGISTER=false` (default)
- [ ] Admin password changed from seed default
- [ ] Cloudinary credentials verified with a test upload
- [ ] `VITE_API_URL` points at production API (not localhost)
- [ ] CORS `CLIENT_URL` matches the live site (no trailing slash issues are normalized)
- [ ] Home + About pages published (or re-seeded)
- [ ] Favicon / logo / contact email set in Studio → Settings
- [ ] Robots/sitemap reachable under `/api/seo/...`
- [ ] HTTPS everywhere (cookies use `SameSite=None; Secure` in production)

---

## Local development

```bash
# API
cd server
cp .env.example .env   # fill secrets
npm install
npm run seed:admin
npm run seed:pages
npm run dev

# Client
cd client
cp .env.example .env
npm install
npm run dev
```

Studio: `http://localhost:5173/studio/login` (port may vary)
