# DIL & DATA

A personal publishing platform — **DIL & DATA** by Manogna, home of **Shakti's Blog**.

```
dil-and-data/
├── client/          # React + Vite (Vercel)
├── server/          # Express API (Render)
└── DEPLOYMENT.md    # Production deploy guide
```

## Features

- Public journal: Home/About CMS pages, blogs, categories, contact, newsletter
- Creator Studio: content editor (TipTap), media library (Cloudinary), page builder, categories, comments, subscribers, SEO, settings
- Auth: JWT (cookie + Bearer), admin-only Studio
- Scheduled publishing (drafts with `scheduledFor` auto-publish)

## Getting started

### Backend

```bash
cd server
cp .env.example .env
npm install
npm run seed:admin
npm run seed:pages
npm run dev
```

API: `http://localhost:5050` · Health: `GET /api/health`

### Frontend

```bash
cd client
cp .env.example .env
npm install
npm run dev
```

## Admin credentials (seed default)

| Field | Value |
|-------|--------|
| Email | `admin@dilanddata.com` |
| Password | `ChangeMe123!` |

Change this immediately after first login (or reseed with `SEED_ADMIN_PASSWORD`).

Studio: `/studio/login`

## Design

| Token | Hex |
|-------|-----|
| Background | `#F7F2EF` |
| Surface | `#EDE3DE` |
| Text | `#2E2826` |
| Accent | `#C9A8A3` |

Fonts: Cinzel, Playfair Display, Cormorant Garamond

## Deploy

See [DEPLOYMENT.md](./DEPLOYMENT.md) for Vercel + Render + Atlas + Cloudinary.
