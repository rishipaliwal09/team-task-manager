# Team Task Manager — Full Audit & Deployment Fix

## What the app is

| Part | Technology | Hosted on |
|------|------------|-----------|
| Frontend | React + Vite + Firebase SDK | **Railway** (`client/`) |
| Auth & DB | Firebase Auth + Firestore | **Firebase** (Google) |
| Old API | Express + MongoDB (`server/`) | **NOT USED** — ignore for deploy |

---

## Mistakes found & fixed

### 1. Railway 502 / crash — `Cannot find module '/app/serve.js'`
- **Cause:** Start command was `node serve.js` but Docker image did not include `serve.js`.
- **Fix:** Dockerfile copies `serve.js` + `dist/`.

### 2. Railway 502 — out of memory (likely)
- **Cause:** Production container ran `npm ci --omit=dev` and installed Firebase + React (hundreds of MB) only to serve static files.
- **Fix:** Production stage installs **only `express`**.

### 3. Wrong build commands
- **Cause:** `cd client` when Root Directory was already `client`.
- **Fix:** No `cd client` in any command. Root Directory = `client`.

### 4. Nixpacks vs Dockerfile conflict
- **Cause:** Old `railway.json` used NIXPACKS; UI showed deprecated Nixpacks.
- **Fix:** `railway.json` uses `"builder": "DOCKERFILE"` only. Removed duplicate `railway.toml`.

### 5. Firebase env at build time
- **Cause:** Vite needs `VITE_FIREBASE_*` **during** `npm run build`. If placeholders or missing, live app breaks (login/API).
- **Fix:** Set all variables in Railway **before** deploy. Redeploy after changing them.

### 6. Firebase authorized domain
- **Cause:** Login fails on Railway URL if domain not added (not 502, but looks “broken”).
- **Fix:** Add `your-app.up.railway.app` in Firebase → Authentication → Authorized domains.

### 7. Firestore rules not published
- **Cause:** `Missing or insufficient permissions` on signup/tasks.
- **Fix:** Publish `firebase/PASTE_IN_CONSOLE.rules` in Firebase Console.

---

## Correct Railway settings (copy exactly)

**Service:** team-task-manager  
**Root Directory:** `client`

| Setting | Value |
|---------|--------|
| Builder | Dockerfile (from `railway.json`) |
| Build Command | *(leave empty)* |
| Start Command | *(leave empty — uses Dockerfile CMD)* |
| Custom start `node serve.js` | OK if set, but file must exist in image (Dockerfile includes it) |

### Variables (all required, real values)

```
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN=team-managment-system.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=team-managment-system
VITE_FIREBASE_STORAGE_BUCKET=team-managment-system.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=531038508116
VITE_FIREBASE_APP_ID=1:531038508116:web:8895ef640118cde559c9c1
VITE_FIREBASE_MEASUREMENT_ID=G-ZVNKN9ZQFR
```

---

## Files that MUST be on GitHub in `client/`

- [ ] `Dockerfile`
- [ ] `serve.js`
- [ ] `package.json`
- [ ] `package-lock.json`
- [ ] `railway.json`
- [ ] `src/` (all React code)
- [ ] `index.html`
- [ ] `vite.config.js`

**Do NOT commit:** `node_modules/`, `dist/`, `.env`

---

## Deploy steps (final)

1. Push all `client/` changes to GitHub.
2. Railway → Settings → Root Directory = `client`.
3. Clear Build Command and Start Command (or Start = empty).
4. Variables → all `VITE_FIREBASE_*` with real values.
5. Networking → Generate Domain.
6. Deployments → wait for **Success**.
7. Open URL → should see login page.
8. Firebase → Authorized domains → add Railway host.
9. Test signup/login.

---

## Verify locally (works on your PC)

```powershell
cd client
npm run build
$env:PORT=3000
node serve.js
```

Open http://localhost:3000 — login page should load.

---

## If still 502

1. Deployments → **View logs** (Deploy, not Build).
2. Look for:
   - `Build missing: dist/index.html` → build failed
   - `Cannot find module` → old image / wrong start command
   - `Killed` / `OOM` → memory (fixed by slim Dockerfile)
3. Redeploy after push.

---

## App features status (code is OK)

| Feature | Status |
|---------|--------|
| Signup / Login | OK |
| Admin / Member roles | OK |
| Projects | OK |
| Tasks + assign | OK |
| Task updates | OK |
| Dashboard + member list | OK |
| Firestore rules | Must be published in Firebase Console |

Deployment issues were **hosting config**, not missing app features.
