================================================================================
                        TASK FLOW - Team Task Manager
                          Full-Stack Web Application
================================================================================

OVERVIEW
--------
Task Flow is a collaborative team task management web application where
multiple users can create and join projects, assign tasks to team members,
and track progress in real time. Each user is assigned a role (Admin or
Member), and tasks are managed within project-based teams. It is a
simplified version of tools like Trello or Asana, built as a full-stack
application with a modern, responsive user interface.

Live Demo: https://ideal-intuition-production-5f1d.up.railway.app/


================================================================================
TECH STACK
================================================================================

Backend:
  - Node.js with Express.js
  - SQLite database (via Prisma ORM)
  - JWT-based authentication using httpOnly cookies
  - bcryptjs for password hashing
  - express-validator for server-side input validation
  - cookie-parser for cookie handling
  - CORS configured for cross-origin requests

Frontend:
  - React 18 with Vite build tool
  - React Router v6 for client-side routing
  - Tailwind CSS v3 for styling (custom UI, no component libraries)
  - Axios with request/response interceptors
  - React Context API for authentication and theme state
  - Recharts for dashboard charts (line chart, pie chart)
  - react-hot-toast for toast notifications
  - lucide-react for icons


================================================================================
FEATURES
================================================================================

1. User Authentication
   - Signup with Name, Email, and Password
   - Secure login with JWT stored in httpOnly cookies
   - Automatic session restoration on page reload
   - Separate login portals for Admin and Member users
   - Logout functionality with cookie clearance

2. Role-Based Access Control (RBAC)
   - Two roles: Admin and Member
   - Role selection during signup
   - Admin Portal: restricted login page for administrators only
   - Server-side role enforcement on all protected routes
   - Client-side role-based UI rendering

3. Project Management
   - Create new projects (creator is automatically assigned Admin role)
   - View all projects the user is a member of
   - Update project name and description (Admin only)
   - Delete projects (Admin only)
   - Add members to a project by email (Admin only)
   - Remove members from a project (Admin only)
   - Cannot remove the sole Admin from a project

4. Task Management
   - Create tasks within a project with title, description, priority,
     status, assignee, and due date
   - Update task details (Admin can update all fields; Members can
     only update the status of tasks assigned to them)
   - Delete tasks (Admin only)
   - Filter tasks by status, priority, and assignee
   - Task statuses: To Do, In Progress, Done
   - Task priorities: Low, Medium, High

5. Dashboard
   - General report with stat cards (Total Tasks, Pending, In Progress, Done)
   - Task Activity line chart showing tasks created over the last 6 months
   - Status Distribution pie chart with percentage breakdown
   - Assigned tasks list with status badges
   - Overdue/critical tasks list
   - Tasks per User breakdown (visible to Admin users only)
   - Global search across tasks

6. User Interface
   - Dark mode and light mode with toggle switch
   - Theme preference persisted in localStorage
   - Collapsible sidebar navigation
   - Responsive layout for desktop and mobile
   - Modern design with smooth transitions and hover effects
   - Breadcrumb navigation


================================================================================
PROJECT STRUCTURE
================================================================================

team-task-manager/
|
|-- client/                     # Frontend (React + Vite)
|   |-- public/
|   |-- src/
|   |   |-- api/
|   |   |   |-- axios.js            # Axios instance with interceptors
|   |   |-- components/
|   |   |   |-- LoadingSpinner.jsx
|   |   |   |-- MemberList.jsx
|   |   |   |-- Navbar.jsx
|   |   |   |-- ProtectedRoute.jsx
|   |   |   |-- Sidebar.jsx
|   |   |   |-- StatsCard.jsx
|   |   |   |-- StatusBadge.jsx
|   |   |   |-- TaskCard.jsx
|   |   |   |-- TaskModal.jsx
|   |   |-- context/
|   |   |   |-- AuthContext.jsx      # Auth and theme providers
|   |   |-- hooks/
|   |   |   |-- useAuth.js           # Custom auth and theme hooks
|   |   |-- pages/
|   |   |   |-- AdminLogin.jsx
|   |   |   |-- CreateProject.jsx
|   |   |   |-- Dashboard.jsx
|   |   |   |-- Login.jsx
|   |   |   |-- NotFound.jsx
|   |   |   |-- ProjectDetail.jsx
|   |   |   |-- Projects.jsx
|   |   |   |-- Signup.jsx
|   |   |-- App.jsx
|   |   |-- main.jsx
|   |   |-- index.css
|   |-- index.html
|   |-- package.json
|   |-- vite.config.js
|   |-- tailwind.config.js
|   |-- .env                         # VITE_API_URL
|
|-- server/                     # Backend (Node.js + Express)
|   |-- prisma/
|   |   |-- schema.prisma            # Database schema
|   |   |-- dev.db                   # SQLite database file
|   |-- src/
|   |   |-- controllers/
|   |   |   |-- auth.controller.js
|   |   |   |-- project.controller.js
|   |   |   |-- task.controller.js
|   |   |   |-- user.controller.js
|   |   |-- lib/
|   |   |   |-- prisma.js            # Prisma client singleton
|   |   |-- middleware/
|   |   |   |-- auth.middleware.js    # JWT verification
|   |   |   |-- role.middleware.js    # Project-level RBAC
|   |   |   |-- validate.middleware.js
|   |   |-- routes/
|   |   |   |-- auth.routes.js
|   |   |   |-- project.routes.js
|   |   |   |-- task.routes.js
|   |   |   |-- user.routes.js
|   |   |-- validators/
|   |   |   |-- auth.validator.js
|   |   |   |-- project.validator.js
|   |   |   |-- task.validator.js
|   |   |-- index.js                 # Express app entry point
|   |-- package.json
|   |-- .env                         # DATABASE_URL, JWT_SECRET, etc.
|
|-- .gitignore
|-- README.md
|-- README.txt


================================================================================
DATABASE SCHEMA
================================================================================

User
  - id          (String, primary key)
  - name        (String)
  - email       (String, unique)
  - password    (String, hashed)
  - role        (String, default "MEMBER")
  - createdAt   (DateTime)
  - updatedAt   (DateTime)

Project
  - id          (String, primary key)
  - name        (String)
  - description (String, optional)
  - createdAt   (DateTime)
  - updatedAt   (DateTime)

ProjectMember
  - id          (String, primary key)
  - userId      (String, foreign key -> User)
  - projectId   (String, foreign key -> Project)
  - role        (String, default "MEMBER"; values: ADMIN, MEMBER)
  - Unique constraint on (userId, projectId)

Task
  - id          (String, primary key)
  - title       (String)
  - description (String, optional)
  - status      (String, default "To Do"; values: To Do, In Progress, Done)
  - priority    (String, default "Medium"; values: Low, Medium, High)
  - dueDate     (DateTime, optional)
  - projectId   (String, foreign key -> Project)
  - assigneeId  (String, optional, foreign key -> User)
  - creatorId   (String, foreign key -> User)
  - createdAt   (DateTime)
  - updatedAt   (DateTime)


================================================================================
API ENDPOINTS
================================================================================

Authentication:
  POST   /api/auth/signup          Create a new user account
  POST   /api/auth/login           Authenticate and receive JWT cookie
  POST   /api/auth/logout          Clear authentication cookie
  GET    /api/auth/me              Get current logged-in user details

Projects (all require authentication):
  GET    /api/projects             List all projects for the current user
  POST   /api/projects             Create a new project
  GET    /api/projects/:id         Get project details (member access)
  PUT    /api/projects/:id         Update project (Admin only)
  DELETE /api/projects/:id         Delete project (Admin only)
  POST   /api/projects/:id/members       Add a member by email (Admin only)
  DELETE /api/projects/:id/members/:uid  Remove a member (Admin only)

Tasks (all require authentication and project membership):
  GET    /api/projects/:projectId/tasks            List tasks in a project
  POST   /api/projects/:projectId/tasks            Create a task
  PUT    /api/projects/:projectId/tasks/:taskId    Update a task
  DELETE /api/projects/:projectId/tasks/:taskId    Delete a task (Admin only)

Dashboard:
  GET    /api/dashboard            Get dashboard statistics and charts


================================================================================
PREREQUISITES
================================================================================

Before running the project, ensure the following are installed:

  - Node.js (version 18 or higher)
  - npm (comes with Node.js)
  - Git


================================================================================
HOW TO CLONE AND RUN THE PROJECT
================================================================================

Step 1: Clone the Repository
-----------------------------
  git clone https://github.com/imsahilsaifi/Team-Task-Manager.git
  cd Team-Task-Manager

Step 2: Set Up the Server
--------------------------
  cd server
  npm install

  Create a file named .env in the server directory with the following content:

    DATABASE_URL="file:./dev.db"
    JWT_SECRET=your_jwt_secret_key_here
    CLIENT_URL=http://localhost:5173
    NODE_ENV=development
    PORT=5000

  Note: Replace "your_jwt_secret_key_here" with any long random string.
  You can generate one by running: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

  Then run the database setup and start the server:

    npx prisma db push
    npm run dev

  The server will start on http://localhost:5000

Step 3: Set Up the Client
--------------------------
  Open a new terminal window/tab.

  cd client
  npm install

  Create a file named .env in the client directory with the following content:

    VITE_API_URL=http://localhost:5000/api

  Then start the client:

    npm run dev

  The client will start on http://localhost:5173

Step 4: Open the Application
------------------------------
  Open your browser and navigate to http://localhost:5173

  - Click "Create Account" to register a new user.
  - Select your role (Admin or Member) during signup.
  - After signing up, you will be redirected to the dashboard.
  - To test Admin features, sign up with the "Admin" role selected.
  - To test Member features, sign up with the "Member" role selected.
  - Use the Admin Portal link on the login page for administrator access.


================================================================================
ENVIRONMENT VARIABLES REFERENCE
================================================================================

Server (.env):
  DATABASE_URL    Database connection string (SQLite: "file:./dev.db")
  JWT_SECRET      Secret key used to sign and verify JWT tokens
  CLIENT_URL      Frontend URL for CORS configuration
  NODE_ENV        Environment mode (development or production)
  PORT            Port number for the server (default: 5000)

Client (.env):
  VITE_API_URL    Backend API base URL (e.g., http://localhost:5000/api)


================================================================================
DEPLOYMENT ON RAILWAY
================================================================================

1. Push the code to a GitHub repository.

2. Create two services on Railway:
   - Server Service:
       Root Directory: /server
       Build Command:  npx prisma generate && npx prisma db push
       Start Command:  node src/index.js

   - Client Service:
       Root Directory: /client
       Build Command:  npm run build
       Start Command:  npx serve dist -s -l $PORT

3. Link a PostgreSQL database to the Server service.
   Note: For production deployment, change the Prisma schema provider
   from "sqlite" to "postgresql" and update DATABASE_URL accordingly.

4. Set Environment Variables on Railway:
   - Server: DATABASE_URL, JWT_SECRET, CLIENT_URL, NODE_ENV=production
   - Client: VITE_API_URL (set to the server service URL + /api)


================================================================================
USAGE GUIDE
================================================================================

Admin Workflow:
  1. Sign up and select the "Admin" role.
  2. Create a new project from the sidebar.
  3. Open the project and add team members by their email address.
  4. Create tasks and assign them to team members.
  5. Monitor progress on the dashboard.

Member Workflow:
  1. Sign up and select the "Member" role.
  2. Wait for an Admin to add you to a project using your email.
  3. View your assigned projects in the sidebar.
  4. Open a project and update the status of tasks assigned to you.
  5. Check the dashboard for your task overview.


================================================================================
KNOWN NOTES
================================================================================

  - The .env files are excluded from the repository via .gitignore.
    You must create them manually after cloning.
  - The SQLite database file (dev.db) is generated automatically when
    you run "npx prisma db push".
  - For production, switch to PostgreSQL by changing the provider in
    prisma/schema.prisma and updating the DATABASE_URL accordingly.
  - Both the server and client must be running simultaneously for the
    application to work.


================================================================================
AUTHOR
================================================================================

  Sahil Saifi
  GitHub: https://github.com/imsahilsaifi


================================================================================
