# Team Task Manager (Full-Stack)

A production-ready full-stack team collaboration and task management web application built with Node.js, React, and PostgreSQL.

## Live Demo
[Live Application URL](https://ideal-intuition-production-5f1d.up.railway.app/)

## Tech Stack

**Backend:**
- Node.js + Express.js
- PostgreSQL with Prisma ORM
- JWT authentication (httpOnly cookies)
- bcryptjs for password hashing
- express-validator for input validation

**Frontend:**
- React 18 with Vite
- React Router v6 (createBrowserRouter)
- Tailwind CSS v3 (Custom UI, no external component libraries)
- Axios with interceptors
- React Context for auth & theme state
- react-hot-toast for notifications
- lucide-react for icons

## Features

- **Authentication** — Signup/Login with secure JWT stored in httpOnly cookies.
- **Role-Based Dashboards** — Distinct views for Admins (project management focus) and Members (task assignment focus).
- **Collapsible Dashboard** — Dynamic sections that slide open from the top with toggle options.
- **Project Management** — Create, update, and delete projects with automated membership for creators.
- **Task CRUD** — Complete task lifecycle: Title, Description, Priority (LOW/MEDIUM/HIGH), Status (TODO/IN_PROGRESS/DONE), Assignees, and Due Dates.
- **Member Management** — Admins can add/remove team members by email with role assignment.
- **Dark/Light Mode** — Premium modern toggle switch with system persistence.
- **Responsive Design** — Fully optimized for desktop and mobile with a collapsible sidebar.
- **RBAC Enforcement** — Strict server-side and client-side role validation.

## Local Setup

### 1. Prerequisites
- Node.js 18+
- PostgreSQL database

### 2. Clone the repository
```bash
git clone <repository-url>
cd team-task-manager
```

### 3. Server Setup
```bash
cd server
npm install
cp .env.example .env
# Update .env with your DATABASE_URL and JWT_SECRET
npx prisma db push
npm run dev
```

### 4. Client Setup
```bash
cd ../client
npm install
npm run dev
```

Visit `http://localhost:5173` to view the app.

## API Documentation

| Method | Path | Description | Auth Required | Role Required |
|---|---|---|---|---|
| POST | `/api/auth/signup` | Create new account | No | - |
| POST | `/api/auth/login` | Authenticate user | No | - |
| GET | `/api/auth/me` | Get current session | Yes | - |
| GET | `/api/projects` | List projects | Yes | - |
| POST | `/api/projects` | Create project | Yes | - |
| GET | `/api/projects/:id` | Project details | Yes | Member |
| PUT | `/api/projects/:id` | Update project | Yes | ADMIN |
| DELETE | `/api/projects/:id` | Delete project | Yes | ADMIN |
| POST | `/api/projects/:id/members` | Add member | Yes | ADMIN |
| GET | `/api/dashboard` | Global stats | Yes | - |

## Deployment on Railway

1. Push code to GitHub.
2. Create two services in Railway:
   - **Server**: Root `/server`, Build `npx prisma generate && npx prisma db push`, Start `node src/index.js`.
   - **Client**: Root `/client`, Build `npm run build`, Start `npx serve dist -s -l $PORT`.
3. Link a PostgreSQL database to the Server service.
4. Set Environment Variables:
   - **Server**: `DATABASE_URL`, `JWT_SECRET`, `CLIENT_URL` (client service url), `NODE_ENV=production`.
   - **Client**: `VITE_API_URL` (server service url + /api).
