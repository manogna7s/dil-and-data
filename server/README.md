# DIL & DATA API

Production-grade Express + MongoDB backend for the personal publishing platform.

## Stack

Node.js · Express · MongoDB/Mongoose · JWT · Cloudinary · Multer

## Architecture

```
Request → routes → validators → auth → controllers → services → models
                                                      ↘ Cloudinary
```

Polymorphic **Content** documents use a `type` field (`blog`, `travel`, `poetry`, …)
so new journal sections do not require new collections.

## Setup

1. Copy `.env.example` → `.env` and fill MongoDB + JWT (+ Cloudinary for uploads).
2. `npm install`
3. `npm run seed:admin` (optional first admin)
4. `npm run dev`

## Key endpoints

| Area | Methods |
|------|---------|
| `GET /api/health` | Health |
| `/api/auth` | login, logout, register, profile |
| `/api/content` | CRUD, publish, draft, search, featured, recent |
| `/api/categories` | CRUD |
| `/api/comments` | create, list, moderate |
| `/api/likes` | toggle, status |
| `/api/subscribers` | subscribe, unsubscribe, list |
| `/api/media` | upload, delete, list |
| `/api/settings` | get, update |

All responses use:

```json
{ "success": true, "message": "...", "data": {}, "errors": null }
```
