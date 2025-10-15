Collaborative Task Manager

A full-stack task management web application built with Django REST Framework (backend) and React + Vite (frontend).
It includes JWT authentication, CRUD operations for tasks, filtering, search, dashboard analytics, and a modular, deploy-ready architecture.

Features

1. User authentication with JWT (via djangorestframework-simplejwt)
2. Task management (create, update, delete, list, and filter tasks)
3. Dashboard analytics (tasks per status, tasks due today/this week)
4. Filtering and search by status, priority, and due date
5. React frontend with Vite and Axios
6. Secure API with per-user task ownership
7. SQLite for local development (easily replaceable with PostgreSQL)

Folder Structure
project-root/
│
├── backend/                   # Django REST backend
│   ├── core/                  # Project configuration
│   │   ├── settings.py
│   │   ├── urls.py
│   │   ├── wsgi.py
│   │   └── asgi.py
│   │
│   ├── tasks/                 # Tasks app
│   │   ├── models.py
│   │   ├── views.py
│   │   ├── serializers.py
│   │   ├── filters.py
│   │   └── urls.py
│   │
│   ├── db.sqlite3
│   ├── manage.py
│   └── .venv/                 # Python virtual environment
│
├── taskmanager/               # React frontend (Vite)
│   ├── src/
│   ├── package.json
│   ├── vite.config.ts
│   └── node_modules/
│
└── README.md

Backend Setup (Django + DRF)
1. Create and Activate Virtual Environment
  cd backend
  python -m venv .venv
  .\.venv\Scripts\activate       # Windows

2. Install Dependencies
pip install django djangorestframework djangorestframework-simplejwt django-filter

3. Run Initial Setup
  python manage.py makemigrations tasks
  python manage.py migrate
  python manage.py createsuperuser

4. Run the Server
  python manage.py runserver 0.0.0.0:8000


Access the Django admin at http://localhost:8000/admin/
 using your superuser credentials.

Frontend Setup (React + Vite)
1. Install Dependencies
cd ../taskmanager
npm install

2. Start the Dev Server
npm run dev

Frontend runs on http://localhost:5173

Axios Configuration (src/api/axios.ts)

  import axios from "axios";

export default axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
});

Vite Proxy Configuration (vite.config.ts)
server: {
  port: 5173,
  proxy: {
    '/api': {
      target: 'http://localhost:8000',
      changeOrigin: true,
      secure: false,
      rewrite: (path) => path.replace(/^\/api/, ''),
    },
  },
},

API Endpoints
**Authentication**
Method	  Endpoint	            Description
POST	    /auth/register/	      Register a new user
POST	    /auth/login/	        Obtain JWT access and refresh tokens
POST	    /auth/refresh/	      Refresh the access token


**Tasks**
Method	        Endpoint	        Description
GET	             /tasks/	        List all user tasks (with filtering and search)
POST	           /tasks/	        Create a new task
GET/PUT/DELETE	/tasks/{id}/	    Retrieve, update, or delete a specific task
GET	            /tasks/stats/	    Get dashboard summary statistics

**Task Model**
Field	          Type	            Description
id	            AutoField	        Auto-generated ID
title	          String	          Required
description	    Text	            Optional
status	        Choice	          Pending, In Progress, or Completed
priority	      Choice	          Low, Medium, or High
due_date	      Date	            Optional
created_at	    DateTime	        Auto-added on creation
updated_at	    DateTime	        Auto-updated on change
owner	          ForeignKey	      Linked to the authenticated user


Dashboard Statistics
1. Counts tasks grouped by status (pending, in-progress, completed)
2. Highlights tasks due today and within the current week
3. Aggregates statistics using Django ORM with Count and Q filters


Authentication Flow
1. Register → POST /auth/register/
2. Login → POST /auth/login/ → returns access and refresh tokens
3. Use the JWT access token in subsequent API requests:

Authorization: Bearer <access_token>

4. Refresh expired tokens using /auth/refresh/

Summary

1. This project demonstrates a clean full-stack architecture combining:
2. Django REST Framework for backend API and authentication.
3. React + Vite for responsive and dynamic frontend.
4. Secure JWT-based user authentication.
5. Modular and scalable setup ready for production deployment.