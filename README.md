<h1 align="left">Collaborative Task Manager</h1>

###

<p align="left">
A full-stack task management web application built with <strong>Django REST Framework</strong> (backend) and <strong>React + Vite</strong> (frontend).  
Includes JWT authentication, task CRUD operations, dashboard analytics, and a scalable modular structure ready for deployment.
</p>

###

<h2 align="left">🚀 Tech Stack</h2>

###

<div align="left">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" height="40" alt="python logo" />
  <img width="12" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/django/django-plain.svg" height="40" alt="django logo" />
  <img width="12" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" height="40" alt="react logo" />
  <img width="12" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" height="40" alt="typescript logo" />
  <img width="12" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vite/vite-original.svg" height="40" alt="vite logo" />
  <img width="12" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/npm/npm-original-wordmark.svg" height="40" alt="npm logo" />
</div>

###

<h2 align="left">📁 Project Structure</h2>

```plaintext
project-root/
│
├── backend/                   # Django REST API
│   ├── core/                  # Project configuration
│   ├── tasks/                 # Task management app
│   ├── db.sqlite3
│   └── manage.py
│
├── taskmanager/               # React + Vite frontend
│   ├── src/
│   ├── package.json
│   ├── vite.config.ts
│   └── node_modules/
│
└── README.md
```

---

<h2 align="left">⚙️ Backend Setup</h2>

```bash
cd backend
python -m venv .venv
.\.venv\Scripts\activate   # Windows
# source .venv/bin/activate (Mac/Linux)

pip install django djangorestframework djangorestframework-simplejwt django-filter

python manage.py makemigrations tasks
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver 0.0.0.0:8000

```

Access Django Admin → http://localhost:8000/admin/

```
cd ../taskmanager
npm install
npm run dev
```

Runs on → http://localhost:5173

<h2 align="left">🔗 API Overview</h2>

Authentication
```plaintext
Method	  Endpoint	          Description
POST	    /auth/register/	    Register new user
POST	    /auth/login/	      Obtain JWT tokens
POST	    /auth/refresh/	    Refresh access token
```
Tasks
```plaintext
Method	          Endpoint	      Description
GET	              /tasks/	        List all tasks
POST	            /tasks/	        Create task
GET/PUT/DELETE	  /tasks/{id}/	  Retrieve / update / delete task
GET	              /tasks/stats/	  Get dashboard stats
```
<h2 align="left">🧩 Core Features</h2>

Secure JWT authentication

CRUD task management per user

Dashboard with task analytics (status, due date)

Filtering and search (status, priority, date)

Modular codebase ready for scaling

Simple local setup using SQLite

<h2 align="left">📊 Dashboard Logic</h2>

Aggregates tasks by status using Django ORM Count

Tracks overdue and weekly tasks

Returns analytics data to the React frontend

<h2 align="left">🧠 Authentication Flow</h2>

Register → POST /auth/register/

Login → POST /auth/login/ → Receive JWT tokens

Include Authorization: Bearer <access_token> in requests

Refresh token via /auth/refresh/

<h2 align="left">📄 Summary</h2>

A clean, full-stack architecture that combines:

Django REST Framework for the backend

React + Vite for the frontend

JWT-based authentication

Scalable modular project structure

Built for clarity, speed, and real-world scalability.
