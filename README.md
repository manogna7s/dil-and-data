# DIL & DATA

A production-grade personal publishing platform.

## Architecture

```
dil-and-data/
├── client/    # React + Vite (Vercel)
└── server/    # Express API (Render)
```

## Phase 1 — Foundation

- Project structure and design system
- React Router with placeholder pages
- Express health endpoint (`GET /api/health`)
- No auth, MongoDB, or blog APIs yet

## Getting started

### Frontend

```bash
cd client
npm install
npm run dev
```

Runs at `http://localhost:5173` (Vite may pick the next free port if busy).

### Backend

```bash
cd server
npm install
# set MONGODB_URI + JWT_SECRET in .env
npm run seed:admin   # optional
npm run dev
```

Runs at `http://localhost:5050`.

Health check: `GET http://localhost:5050/api/health`

## Design tokens

| Token      | Hex       |
|------------|-----------|
| Background | `#F7F2EF` |
| Surface    | `#EDE3DE` |
| Text       | `#2E2826` |
| Secondary  | `#7A706B` |
| Accent     | `#C9A8A3` |
| Highlight  | `#E5CDC8` |

Fonts: Cinzel, Playfair Display, Cormorant Garamond
