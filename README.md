# CHAMPA LAIYVAN Loan Management Web App

Deploy-ready Vite + React frontend.

## 1) Run locally

Requirements: Node.js 20+

```bash
npm install
npm run dev
```

## 2) Build for production

```bash
npm run build
npm run preview
```

## 3) Deploy to GitHub Pages

1. Create a GitHub repository, e.g. `champa-laiyvan-loan-app`.
2. Upload ALL files in this folder (do not upload the ZIP itself as the project).
3. Commit to the `main` branch.
4. Open **Settings → Pages**.
5. Under Build and deployment, choose **GitHub Actions**.
6. Push/commit again if necessary. The included workflow `.github/workflows/deploy-pages.yml` builds and deploys automatically.
7. Your site will be available at:
   `https://YOUR_GITHUB_USERNAME.github.io/champa-laiyvan-loan-app/`

## 4) Deploy to Vercel (recommended for easiest deployment)

1. Import the GitHub repository into Vercel.
2. Vercel detects Vite automatically.
3. Build command: `npm run build`
4. Output directory: `dist`
5. Deploy.

`vercel.json` is already included.

## Demo accounts

- Admin: `admin@laoloan.la` / `admin123`
- Officer: `officer@laoloan.la` / `officer123`
- Customer: `020 5555 1234` / `customer123`

## Important production note

This is a deploy-ready frontend prototype. User/application/payment data is stored in browser `localStorage`. Do NOT use this storage/authentication design for real financial production data.

For production, connect a secure backend such as Supabase/Postgres or another server-side database, implement server-side authentication/authorization, audit logs, encrypted document storage, and a real OCR service. Never put database/service secrets in frontend code.
