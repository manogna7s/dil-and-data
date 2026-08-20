# DIL & DATA

My personal publishing platform — **DIL & DATA** by Manogna, home of **Shakti's Blog**.

Live at dilanddata.in

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

API Health: `GET /api/health`

### Frontend

```bash
cd client
cp .env.example .env
npm install
npm run dev
```

## Deploy

See [DEPLOYMENT.md](./DEPLOYMENT.md) for Vercel + Render + Atlas + Cloudinary.
