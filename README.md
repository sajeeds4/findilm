<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# FindIlm (React + Django)

This app now uses:
- Frontend: React + Vite
- Backend: Django + Django REST Framework

## Local development

### 1) Frontend setup

Prerequisite: Node.js

1. Install dependencies:
   `npm install`
2. Create `.env.local` and set:
   - `GEMINI_API_KEY=...` (for current client-side AI features)
   - `VITE_BACKEND_URL=http://127.0.0.1:8000` (optional; default already set)
3. Run frontend:
   `npm run dev`

### 2) Django backend setup

Prerequisite: Python 3.11+

1. Create virtual env and install dependencies:
   - `cd backend`
   - `python -m venv .venv`
   - `source .venv/bin/activate`
   - `pip install -r requirements.txt`
2. Copy env template:
   - `cp .env.example .env`
3. Run migrations:
   - `python manage.py migrate`
4. (Optional) Create admin user:
   - `python manage.py createsuperuser`
5. Start backend:
   - `python manage.py runserver 0.0.0.0:8000`

### 3) Backend bootstrap data

To preload the backend with starter community posts, courses, resources, and podcast data:

- `python manage.py seed_findilm`

### 4) Run backend tests

- `python manage.py test`

## API endpoints

Core:
- `GET /api/health`
- `GET /api/data/daily-ayah`
- `GET /api/prayer/today?latitude=...&longitude=...`

Auth:
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`

Dashboard and journaling:
- `GET /api/dashboard/summary`
- `GET, POST /api/reflections`
- `DELETE /api/reflections/:id`

Community and support:
- `GET, POST /api/duas`
- `POST /api/duas/:id/ameen`
- `GET /api/community/categories`
- `GET, POST /api/community/posts`
- `POST /api/community/posts/:id/like`
- `POST /api/community/posts/:id/bookmark`

Learning and content:
- `GET /api/courses`
- `GET /api/courses/featured`
- `POST /api/courses/:slug/enroll`
- `GET /api/resources/categories`
- `GET /api/resources`
- `GET /api/audio/episodes`

Assistant history:
- `GET, POST /api/assistant/conversations`
- `GET, POST /api/assistant/conversations/:id/messages`

## Notes

- Vite proxies `/api/*` requests to Django in development.
- Frontend email auth form already calls Django auth endpoints.
- Some frontend areas still use Firebase or direct third-party APIs today; the Django backend now provides a stronger API foundation to migrate those screens onto one backend over time.
