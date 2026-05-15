# Deploy Team Task Manager on Railway

Your app uses **Firebase** (Auth + Firestore) from the browser. Railway only hosts the **React frontend**. No MongoDB/Express server is required for production.

---

## Before you deploy

1. **GitHub repo** — push `team-task-manager` to GitHub
2. **Firestore rules** — published in Firebase Console (`firebase/PASTE_IN_CONSOLE.rules`)
3. **Email/Password auth** — enabled in Firebase Console

---

## Step 1: Push code to GitHub

```bash
cd "C:\Users\Admin\Desktop\Team Task manager\team-task-manager"
git init
git add .
git commit -m "Team Task Manager - Firebase + React"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/team-task-manager.git
git push -u origin main
```

Do **not** commit `client/.env` (it is gitignored).

---

## Step 2: Create Railway project

1. Go to [railway.com](https://railway.com) and sign in
2. **New Project** → **Deploy from GitHub repo**
3. Select your repository
4. Railway may auto-detect the app — configure manually (Step 3)

---

## Step 3: Configure the service

Open the service → **Settings**:

| Setting | Value |
|--------|--------|
| **Root Directory** | `client` |
| **Build Command** | `npm install --include=dev && npm run build` |
| **Start Command** | `npm start` |

**Do NOT use `cd client` in build/start commands when Root Directory is already `client`.**

Or leave defaults if `client/railway.json` is detected.

---

## Step 4: Add environment variables

In Railway → your service → **Variables**, add (same values as local `client/.env`):

| Variable | Example |
|----------|---------|
| `VITE_FIREBASE_API_KEY` | `AIzaSy...` |
| `VITE_FIREBASE_AUTH_DOMAIN` | `team-managment-system.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID` | `team-managment-system` |
| `VITE_FIREBASE_STORAGE_BUCKET` | `team-managment-system.firebasestorage.app` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | `531038508116` |
| `VITE_FIREBASE_APP_ID` | `1:531038508116:web:...` |
| `VITE_FIREBASE_MEASUREMENT_ID` | `G-ZVNKN9ZQFR` (optional) |

**Important:** Vite bakes these in at **build time**. After changing variables, trigger **Redeploy**.

---

## Step 5: Generate a public URL

1. **Settings** → **Networking** → **Generate Domain**
2. You get a URL like `https://your-app.up.railway.app`

---

## Step 6: Allow Railway in Firebase

1. [Firebase Console](https://console.firebase.google.com/) → **team-managment-system**
2. **Authentication** → **Settings** → **Authorized domains**
3. Click **Add domain** → paste your Railway host (e.g. `your-app.up.railway.app`) **without** `https://`
4. Save

(Optional) **Project settings** → restrict API key to your Railway domain for extra security.

---

## Step 7: Redeploy and test

1. Railway → **Deployments** → wait for **Success**
2. Open your Railway URL
3. Sign up / log in and test projects, tasks, and updates

---

## Troubleshooting

| Problem | Fix |
|--------|-----|
| Blank page after deploy | Check build logs; confirm all `VITE_*` vars are set before build |
| Firebase auth error | Add Railway domain to Firebase **Authorized domains** |
| Permission denied on Firestore | Publish `firebase/PASTE_IN_CONSOLE.rules` in Firebase Console |
| 404 on refresh (/dashboard) | `serve.js` handles SPA routing — ensure **Start Command** is `npm start` |
| Build fails | Root directory must be `client`, not repo root |

---

## What you do NOT deploy on Railway

- `server/` (old Express + MongoDB) — not used by the Firebase app
- Firebase itself — stays on Google Cloud

---

## Custom domain (optional)

Railway → **Settings** → **Networking** → **Custom Domain** → follow DNS instructions → add that domain in Firebase **Authorized domains** too.
