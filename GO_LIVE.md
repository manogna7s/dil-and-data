# Go-live walkthrough — step by step

Do these in order. You can finish **1** and **3–4** on localhost first; do **2** when you are ready to put the site on the internet.

---

## Step 1 — Change the admin password

There is no “change password” screen yet. Recreate the admin with a new password via seed.

### Locally

1. Open a terminal in the project:

```bash
cd "C:\Users\manog\dil and data\server"
```

2. Set a strong password (PowerShell):

```powershell
$env:FORCE_SEED="true"
$env:SEED_ADMIN_EMAIL="admin@dilanddata.com"
$env:SEED_ADMIN_PASSWORD="5196423xx!"
$env:SEED_ADMIN_NAME="Manogna"
npm run seed:admin
```

3. Confirm you see: `Admin created: admin@dilanddata.com`

4. Log in at `/studio/login` with the **new** password.

5. Clear the env vars when done:

```powershell
Remove-Item Env:FORCE_SEED, Env:SEED_ADMIN_PASSWORD, Env:SEED_ADMIN_EMAIL, Env:SEED_ADMIN_NAME -ErrorAction SilentlyContinue
```

### On Render (after API is deployed)

1. Render dashboard → your API service → **Shell**
2. Run:

```bash
FORCE_SEED=true SEED_ADMIN_EMAIL=admin@dilanddata.com SEED_ADMIN_PASSWORD='YourStrongPasswordHere!' SEED_ADMIN_NAME=Manogna npm run seed:admin
```

Use that new password for all future Studio logins. Do **not** leave `ChangeMe123!` in production.

---

## Step 2 — Set Render + Vercel env vars

You need four services: MongoDB Atlas, Cloudinary, Render (API), Vercel (site).

### 2A — MongoDB Atlas

1. Go to [https://cloud.mongodb.com](https://cloud.mongodb.com) → create a free cluster if you do not have one.
2. **Database Access** → add a user (username + password). Save them.
3. **Network Access** → **Add IP Address** → `0.0.0.0/0` (allow from anywhere; required for Render free tier).
4. **Database** → **Connect** → **Drivers** → copy the URI.  
   Replace `<password>` and set the DB name, e.g. `...mongodb.net/dil-and-data?retryWrites=true&w=majority`

### 2B — Cloudinary

1. Go to [https://cloudinary.com](https://cloudinary.com) → Dashboard.
2. Copy **Cloud name**, **API Key**, **API Secret**.

### 2C — Deploy API on Render

1. Push this repo to GitHub if it is not already there.
2. [https://dashboard.render.com](https://dashboard.render.com) → **New** → **Web Service** → connect the repo.
3. Settings:
   - **Root Directory:** `server`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
4. **Environment** → add:

| Key | Value |
|-----|--------|
| `NODE_ENV` | `production` |
| `PORT` | `10000` |
| `CLIENT_URL` | `https://YOUR-VERCEL-URL.vercel.app` (update after Vercel deploy) |
| `MONGODB_URI` | your Atlas URI |
| `JWT_SECRET` | long random string (e.g. 32+ chars) |
| `JWT_EXPIRES_IN` | `7d` |
| `CLOUDINARY_CLOUD_NAME` | from Cloudinary |
| `CLOUDINARY_API_KEY` | from Cloudinary |
| `CLOUDINARY_API_SECRET` | from Cloudinary |
| `CLOUDINARY_FOLDER` | `dil-and-data` |
| `API_PUBLIC_URL` | `https://YOUR-RENDER-SERVICE.onrender.com/api` |
| `ALLOW_REGISTER` | `false` |
| `RATE_LIMIT_MAX` | `1000` |

5. Deploy. Wait until it is **Live**.
6. Open: `https://YOUR-RENDER-SERVICE.onrender.com/api/health`  
   You should see `"status":"OK"`.
7. In Render **Shell**, seed admin + pages:

```bash
FORCE_SEED=true SEED_ADMIN_PASSWORD='YourStrongPasswordHere!' npm run seed:admin
npm run seed:pages
```

(Use `FORCE_SEED=true` with seed:pages only if you want to reset home/about blocks.)

### 2D — Deploy client on Vercel

1. [https://vercel.com](https://vercel.com) → **Add New Project** → import the same GitHub repo.
2. Settings:
   - **Root Directory:** `client`
   - Framework: **Vite** (auto-detected)
3. **Environment Variables:**

| Key | Value |
|-----|--------|
| `VITE_API_URL` | `https://YOUR-RENDER-SERVICE.onrender.com/api` |

4. Deploy.
5. Copy the Vercel URL (e.g. `https://dil-and-data.vercel.app`).
6. Go back to **Render** → Environment → set:

| Key | Value |
|-----|--------|
| `CLIENT_URL` | `https://dil-and-data.vercel.app` |

7. **Manual Deploy** → clear cache / redeploy the API so CORS picks up the new client URL.
8. Open the Vercel site → `/studio/login` → log in with the production admin password.

### Optional — custom domain

1. Vercel → Project → **Domains** → add `yourdomain.com` → follow DNS instructions.
2. Render → add custom domain for API if you want `api.yourdomain.com`.
3. Update `CLIENT_URL`, `API_PUBLIC_URL`, and `VITE_API_URL`, then redeploy both.
4. In Studio → **SEO** → set **Canonical base** to `https://yourdomain.com`.

---

## Step 3 — Studio → Settings (contact, socials, logo, favicon)

1. Open Studio: `https://YOUR-SITE/studio/login` (or local Vite URL).
2. Log in as admin.
3. Sidebar → **Settings**.

### Contact email

1. Find the **Contact** fields.
2. Set **Email** to the address you want letters to reach (used by the Contact page `mailto:` and “email directly” link).
3. Optional: phone, location, short note.
4. Wait for autosave (“Saved …”) or press **Ctrl/Cmd+S**.

### Social links

1. In **Socials**, click **Add** (or similar).
2. For each network set:
   - **Label** (e.g. Instagram)
   - **Href** (full URL, e.g. `https://instagram.com/you`)
   - **id** if the UI asks (e.g. `instagram`, `youtube`, `email`) — used for icons
3. Save.

### Logo

1. Open **Media** in the sidebar → upload a logo image (folder e.g. `profile` or `gallery`).
2. Copy the image URL, **or** in Settings click the media picker next to **Logo** and choose the file.
3. Save. The footer/logo mark should update on the public site after refresh.

### Favicon

1. Upload a small square image (or `.ico`/PNG) in **Media**.
2. In Settings, set **Favicon** via picker or paste URL.
3. Hard-refresh the public site (Ctrl+Shift+R) to see the new tab icon.

### Optional analytics

- **Google Analytics ID** (e.g. `G-XXXXXXXX`) and/or **Plausible domain** in Settings → Analytics.
- Save; they inject on the public layout.

---

## Step 4 — Publish your first story

1. Studio → **Content** → **New story** (or Quick action “New story”).
2. Write a **title**.
3. Write the body in the TipTap editor.
4. Optional:
   - **Cover image** → Media picker
   - **Category** → create one first under **Categories** if the list is empty
   - **Excerpt**, tags, SEO fields in the settings rail
   - **Featured** checkbox if you want it on the home “Featured story” block
5. Click **Publish** (top bar).  
   Status should become **Published**.
6. Open the public site:
   - Home → featured / latest blocks should show the post (refresh if needed)
   - `/blogs` → story in the list
   - `/blogs/your-slug` → full article

### Tips

- **Draft** keeps it off the public site.
- **Schedule**: set date/time, click Schedule — it stays draft until that time, then auto-publishes.
- To feature on home: edit the post → enable **Featured** → save/publish.

---

## Quick checklist

- [ ] Admin password changed (not `ChangeMe123!`)
- [ ] Atlas + Cloudinary ready
- [ ] Render API live + `/api/health` OK
- [ ] Vercel live + `VITE_API_URL` set
- [ ] Render `CLIENT_URL` = Vercel URL
- [ ] Settings: contact email, socials, logo, favicon
- [ ] At least one published story

Full feature matrix: [PHASE6_REPORT.md](./PHASE6_REPORT.md)  
Deploy reference: [DEPLOYMENT.md](./DEPLOYMENT.md)
