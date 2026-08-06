# JeevanDoot — Rural Community Care Platform

A web application that digitises primary healthcare delivery in rural India. It provides role-based portals built as a single-page React app with an Express + MongoDB REST API:

- **Doctor portal** — patient queue, case summaries, e-prescriptions, specialist referrals, follow-up scheduling, live teleconsultation, performance analytics.
- **Admin / Government portal** — district dashboard, disease cluster surveillance, case-level analytics, high-risk audit log, report generation & export, doctor management, platform configuration.
- **NGO portal** — health camp planning, donation tracking, community outreach and impact reporting.
- **Patient portal** — appointments, prescriptions, consultations, reports, health monitoring and notifications.

The frontend runs in **mock mode** by default (no backend required to explore the UI). A full backend lives in `backend/` with JWT authentication, role-based access control and seeded demo data. The design follows the Material 3 "SwasthyaLink / JeevanDoot" palette.

---

## Prerequisites

- **Node.js** `^18 || ^20 || ^22` (developed with v26)
- **npm** `^10`
- **MongoDB** (only needed to run the backend) — local install, e.g. `mongod`

Check your versions:

```bash
node -v
npm -v
```

---

## Quick Start (frontend only — mock mode)

### 1. Install dependencies

```bash
npm install
```

### 2. Run the development server

```bash
npm run dev
```

The app opens automatically at **http://localhost:5173** (if it doesn't, visit the URL Vite prints in the terminal).

### 3. Explore & log in

The root URL (`/`) shows a public **Home page** with a **Register** page (choose a role: Doctor, Patient, NGO or Government) and a **Sign In** flow. Clicking **Sign In** opens a role picker (`/login`) for Patient, Doctor, NGO and Government. Use one of the demo accounts (any password works — login is mocked):

| Role               | Email                     |
| ------------------ | ------------------------- |
| Admin              | `admin@jeevandoot.org`    |
| Doctor             | `doctor@jeevandoot.org`   |
| Patient            | `patient@jeevandoot.org`  |
| NGO                | `ngo@jeevandoot.org`      |
| Government         | `govt@jeevandoot.org`     |

Example paths once logged in:

- Admin: `http://localhost:5173/admin/dashboard`
- Doctor: `http://localhost:5173/doctor/dashboard`
- NGO: `http://localhost:5173/ngo/dashboard`
- Patient: `http://localhost:5173/patient/dashboard`

---

## Running the Backend (API)

The REST API requires MongoDB. If you're on Windows, start the MongoDB service:

```powershell
net start MongoDB
```

Then:

```bash
cd backend
npm install

# create your environment file (optional, defaults work out of the box)
cp .env.example .env

# seed demo data into MongoDB (use `npm run seed:reset` to wipe & reseed)
npm run seed

# start the API (use `npm start` for a plain server)
npm run dev
```

The API listens at **http://localhost:5000/api/v1** (health check: `/api/v1/health`).

Backend demo accounts all use password **`Password@123`**:

| Role       | Email                    |
| ---------- | ------------------------ |
| Admin      | `admin@jeevandoot.org`   |
| Doctor     | `doctor@jeevandoot.org`  |
| Patient    | `patient@jeevandoot.org` |
| NGO        | `ngo@jeevandoot.org`     |
| Government | `govt@jeevandoot.org`    |

See [`backend/README.md`](backend/README.md) for the full API endpoint reference.

> **Note:** the frontend is not wired to the API yet — it runs on mock data. The `.env` section below shows how the frontend will point at a real backend once wiring is added.

---

## Available Scripts

### Frontend (`/`)

| Command            | Description                                   |
| ------------------ | --------------------------------------------- |
| `npm run dev`      | Starts the Vite dev server with hot reload    |
| `npm run build`    | Creates an optimised production build in `dist/` |
| `npm run preview`  | Serves the production build locally           |
| `npm run lint`     | Runs ESLint on `src` (0 warnings required)    |

### Backend (`backend/`)

| Command            | Description                             |
| ------------------ | --------------------------------------- |
| `npm run dev`      | Starts the API with nodemon (port 5000) |
| `npm start`        | Starts the API without nodemon          |
| `npm run seed`     | Seeds demo data into MongoDB            |
| `npm run seed:reset` | Wipes and reseeds demo data           |

---

## Production Build

```bash
npm run build
npm run preview
```

`vite preview` serves the build at **http://localhost:4173**.

---

## Environment Configuration

The project runs in **mock mode** out of the box — no backend or `.env` file is required.

To point at a real backend instead, create a `.env` file in the project root:

```env
VITE_API_URL=https://api.your-backend.example
VITE_ENABLE_MOCK_API=false
```

Services in `src/services/` automatically fall back to mock data when `VITE_ENABLE_MOCK_API` is `true` (the default) or `VITE_API_URL` is unset.

Backend configuration lives in `backend/.env` — see `backend/.env.example` for the available variables (`PORT`, `MONGODB_URI`, `JWT_SECRET`, `CORS_ORIGIN`, etc.).

---

## Project Structure

```
jeevandoot-web/
├── public/                 # Static assets (logo, favicon, manifest)
├── src/
│   ├── components/
│   │   ├── common/         # Button, Card, Modal, Input, Table, Badge, etc.
│   │   ├── layout/         # Sidebar, Header, DashboardLayout, AuthLayout
│   │   ├── charts/         # Chart.js wrappers & KPI widgets
│   │   ├── map/            # Surveillance map & village clusters
│   │   └── consultation/   # Video call + chat panel
│   ├── pages/
│   │   ├── auth/           # Login & registration flows
│   │   ├── admin/          # Admin pages
│   │   ├── doctor/         # Doctor pages
│   │   ├── patient/        # Patient pages
│   │   ├── ngo/            # NGO pages (dashboard, camps, donations, impact)
│   │   ├── government/     # Government pages (dashboard, schemes, queries)
│   │   └── errors/         # 404 & Unauthorized
│   ├── routes/             # Role-based route collections + ProtectedRoute
│   ├── context/            # Auth, Theme, Notification, User providers
│   ├── hooks/              # useAuth, useFetch, useDebounce, usePagination, etc.
│   ├── services/           # API clients with mock fallbacks
│   ├── utils/              # Constants, validators, formatters, helpers
│   └── styles/             # Design tokens & global styles
├── backend/                # Express + MongoDB REST API
│   ├── config/             # env.js, db.js (Mongo connection)
│   ├── middleware/         # auth (JWT + role), validate, errorHandler, upload
│   ├── models/             # Mongoose schemas (User, Patient, Doctor, ...)
│   ├── controllers/        # request handlers, one per domain
│   ├── routes/             # Express routers mounted under /api/v1
│   ├── services/           # business logic (auth, notifications, dashboards)
│   ├── uploads/            # multer file storage
│   ├── utils/              # ApiError, asyncHandler, response envelope, IDs
│   ├── seed/               # seed.js (demo data)
│   └── server.js           # app entry point
├── .env                    # Optional API config (mock mode by default)
├── index.html
├── package.json
└── vite.config.js
```

---

## Tech Stack

**Frontend**
- **React 18** + **Vite 5**
- **React Router v6** (role-based routing)
- **Tailwind CSS 3** with a custom Material 3 palette
- **Chart.js 4** (line, bar, doughnut, heat map)
- **i18next** (English, Hindi, Gujarati, Marathi)
- **ESLint 9** (flat config)

**Backend**
- **Express 4** + **MongoDB** (Mongoose 8)
- **JWT** authentication with role-based access control
- **express-validator**, **multer** (uploads), **bcryptjs**
