# Placement Preparation Tracker

A minimal, production-ready MERN stack web app to track coding practice, SQL preparation, and job applications — built with a clean Notion/Stripe-inspired light theme.

## Tech Stack

- **MongoDB** + **Mongoose** — data persistence
- **Express.js** — REST API
- **React** (Vite) — frontend SPA
- **Tailwind CSS** — styling
- **JWT** in HTTP-only cookies — secure auth

## Project Structure

```
placement-prep-tracker/
├── backend/
│   ├── config/db.js
│   ├── controllers/     # Business logic
│   ├── middleware/      # Auth + error handling
│   ├── models/          # Mongoose schemas
│   ├── routes/          # API endpoints
│   ├── utils/           # Dashboard calculations
│   └── server.js
└── frontend/
    └── src/
        ├── components/    # Reusable UI
        ├── context/       # Auth state
        ├── pages/         # 3 main views
        └── services/api.js
```

## Pages (3-page limit)

1. **Login / Register** — JWT cookie auth
2. **Dashboard** — metrics, readiness score, quick log modal
3. **Unified Tracker** — tabbed coding / SQL / job pipeline views

## Data Flow (Backend → Frontend)

```
User logs in
  → POST /api/auth/login
  → Server sets httpOnly cookie with JWT
  → React AuthContext calls GET /api/auth/me on load

Dashboard loads
  → GET /api/dashboard/stats (cookie sent automatically)
  → Backend counts CodingLog, SqlLog, JobApplication for user
  → Calculates readiness score and streak
  → Frontend renders MetricCards + ProgressScore

Quick Log modal
  → POST /api/coding | /api/sql | /api/jobs
  → Document saved with user ObjectId
  → Dashboard refetches stats

Tracker page
  → GET /api/coding?difficulty=Easy (optional filter)
  → GET /api/sql
  → GET /api/jobs
  → Tables/pipeline rendered from response arrays
```

## Readiness Score Formula

```
Coding Progress %  = min(100, solved / 100 * 100)
SQL Progress %     = min(100, completed / 50 * 100)
App Progress %     = min(100, applications / 20 * 100)

Readiness Score = (Coding% × 0.4) + (SQL% × 0.3) + (App% × 0.3)
```

## Prerequisites

- Node.js 18+
- MongoDB running locally (or MongoDB Atlas URI)

## Setup

### 1. Backend

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

Server runs at `http://localhost:5000`

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

App runs at `http://localhost:5173`

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Login (sets cookie) |
| POST | `/api/auth/logout` | Clear cookie |
| GET | `/api/auth/me` | Current user |
| GET | `/api/dashboard/stats` | Dashboard metrics |
| GET/POST | `/api/coding` | List / create coding logs |
| PUT/DELETE | `/api/coding/:id` | Update / delete |
| GET/POST | `/api/sql` | List / create SQL logs |
| PUT/DELETE | `/api/sql/:id` | Update / delete |
| GET/POST | `/api/jobs` | List / create applications |
| PUT/DELETE | `/api/jobs/:id` | Update / delete |

## Environment Variables

**backend/.env**

```
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/placement-prep-tracker
JWT_SECRET=your_super_secret_jwt_key_change_in_production
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

## Design Tokens

- Background: `#F8FAFC`
- Primary: `#4F46E5` (Indigo)
- Secondary: `#06B6D4` (Cyan)
- Cards: white with soft shadows

## License

MIT
