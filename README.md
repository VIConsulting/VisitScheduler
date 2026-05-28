# Visit Scheduler — Care Home

A mobile-first web app for managing care home visiting schedules.

## Deploy to GitHub Pages

1. Push this folder as a new GitHub repo
2. Go to **Settings → Pages**
3. Set source to **Deploy from a branch**, branch `main`, folder `/docs`
4. Save — the app will be live at `https://<your-username>.github.io/<repo-name>/`

> The `docs/` folder contains the pre-built app. No CI/CD needed.

## Default login

| Username | Password  | Role  |
|----------|-----------|-------|
| Vinnie   | Bombsight | Admin |

Created automatically on first load if no users exist.

## Local development

```bash
npm install
npm run dev        # dev server at http://localhost:5173
npm run build      # rebuild docs/ for production
```

## Data persistence

All data (users, schedule entries) lives in browser `localStorage`. Use **Admin → Schedule Data → Export JSON** for backups before clearing browser data.

## Roles

| Role   | Can view | Can edit slots | Admin portal |
|--------|----------|----------------|--------------|
| Viewer | ✓        |                |              |
| Editor | ✓        | ✓              |              |
| Admin  | ✓        | ✓              | ✓            |
