# live link-team-task-manager-production-05e9.up.railway.app

# Team Task Manager

Full-stack team task management app with **React + Firebase** (Authentication + Firestore).

## Features

- Signup / Login with Firebase Auth
- Role-based access (`admin`, `member`)
- Create projects (admin only) and add team members
- Create, assign, update, and delete tasks
- Members can update task status on assigned tasks
- Dashboard with task counts (total, todo, in progress, done, overdue)
- Firestore security rules enforce permissions

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React (Vite), Tailwind CSS, React Router |
| Backend | Firebase Auth + Cloud Firestore |
| Legacy API | Express + MongoDB in `/server` (optional, not used by client) |

## Project Structure

```
team-task-manager/
├── client/                 # React frontend (main app)
├── firebase/
│   └── firestore.rules     # Security rules
├── firebase.json
└── server/                 # Legacy Express API (MongoDB)
```

## Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/) and create a project.
2. Enable **Authentication** → Sign-in method → **Email/Password**.
3. Enable **Cloud Firestore** → Create database (start in test mode, then deploy rules).
4. Project Settings → Your apps → Add **Web app** → copy config values.
5. In `client/`, copy `.env.example` to `.env`:

```env
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

6. Install Firebase CLI and deploy rules:

```bash
npm install -g firebase-tools
firebase login
firebase use your-project-id
firebase deploy --only firestore:rules
```

## Run Locally

```bash
cd client
npm install
npm run dev
```

Open `http://localhost:5173`

### Test accounts

1. Sign up as **admin** (select Admin role).
2. Sign up as **member** (different email).
3. Admin: create project → add member → create task → assign to member.
4. Member: update task status on Tasks page.

## Firestore Collections

### `users/{uid}`
```json
{ "name": "...", "email": "...", "role": "admin|member", "createdAt": timestamp }
```

### `projects/{id}`
```json
{ "name": "...", "description": "...", "createdBy": "uid", "members": ["uid"], "createdAt", "updatedAt" }
```

### `tasks/{id}`
```json
{
  "title": "...",
  "description": "...",
  "projectId": "...",
  "assignedTo": "uid",
  "createdBy": "uid",
  "status": "todo|inProgress|done",
  "priority": "low|medium|high",
  "dueDate": timestamp,
  "createdAt": "updatedAt"
}
```

## Pages

| Route | Description |
|-------|-------------|
| `/login` | Sign in |
| `/signup` | Register with role |
| `/dashboard` | Task statistics |
| `/projects` | List/create projects |
| `/projects/:id` | Project details + tasks |
| `/tasks` | Create/manage tasks |

## Deployment

### Frontend (Vercel)

1. Push repo to GitHub.
2. Import project on [Vercel](https://vercel.com).
3. Root directory: `client`
4. Add all `VITE_FIREBASE_*` environment variables.
5. Deploy.

### Firestore Rules

```bash
firebase deploy --only firestore:rules
```

### Optional: Firebase Hosting

```bash
cd client && npm run build
firebase init hosting
# public directory: client/dist
firebase deploy --only hosting
```

## Assignment Checklist

- [x] Signup / Login
- [x] Role-based access
- [x] Create projects
- [x] Add members
- [x] Create tasks
- [x] Assign tasks
- [x] Update task status
- [x] Dashboard counts
- [ ] Live deployment (add your URLs after deploy)
- [ ] GitHub repository
- [x] README

## License

ISC
