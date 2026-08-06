# JeevanDoot — Rural Community Care Platform

A web application that digitises primary healthcare delivery in rural India. It provides role-based portals built as a single-page React app:

- **Doctor portal** — patient queue, case summaries, e-prescriptions, specialist referrals, follow-up scheduling, live teleconsultation, performance analytics.
- **Admin / Government portal** — district dashboard, disease cluster surveillance, case-level analytics, high-risk audit log, report generation & export, doctor management, platform configuration.
- **NGO portal** — health camp planning, donation tracking, community outreach and impact reporting.

All data is currently served by built-in mock services (no backend required). The design follows the Material 3 "SwasthyaLink / JeevanDoot" palette.

---

## Prerequisites

- **Node.js** `^18 || ^20 || ^22` (developed with v26)
- **npm** `^10`

Check your versions:

```bash
node -v
npm -v
```

---

## Getting Started

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
| NGO                | `ngo@jeevandoot.org`      |

Example paths once logged in:

- Admin: `http://localhost:5173/admin/dashboard`
- Doctor: `http://localhost:5173/doctor/dashboard`
- NGO: `http://localhost:5173/ngo/dashboard`

---

## Available Scripts

| Command            | Description                                   |
| ------------------ | --------------------------------------------- |
| `npm run dev`      | Starts the Vite dev server with hot reload    |
| `npm run build`    | Creates an optimised production build in `dist/` |
| `npm run preview`  | Serves the production build locally           |
| `npm run lint`     | Runs ESLint on `src` (0 warnings required)    |

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
│   │   ├── auth/           # Admin / Doctor / Patient login
│   │   ├── admin/          # 8 admin pages
│   │   ├── doctor/         # 8 doctor pages
│   │   ├── ngo/            # 4 NGO pages (dashboard, camps, donations, impact)
│   │   └── errors/         # 404 & Unauthorized
│   ├── routes/             # Role-based route collections + ProtectedRoute
│   ├── context/            # Auth, Theme, Notification, User providers
│   ├── hooks/              # useAuth, useFetch, useDebounce, usePagination, etc.
│   ├── services/           # API clients with mock fallbacks
│   ├── utils/              # Constants, validators, formatters, helpers
│   └── styles/             # Design tokens & global styles
├── .env                    # Optional API config (mock mode by default)
├── index.html
├── package.json
└── vite.config.js
```

---

## Tech Stack

- **React 18** + **Vite 5**
- **React Router v6** (role-based routing)
- **Tailwind CSS 3** with a custom Material 3 palette
- **Chart.js 4** (line, bar, doughnut, heat map)
- **ESLint 9** (flat config)
