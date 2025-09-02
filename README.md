# Smart Bus Management System (SBMS)

A web application for college transport with real-time tracking, ETA, role-based dashboards, and CRUD management.

## Tech Stack
- Frontend: React, Vite, Tailwind, React Router, Axios
- Backend: Node.js, Express.js
- DB: MongoDB (Mongoose)
- Auth: JWT, bcrypt
- Maps: Google Maps or Mapbox (configurable)
- CI/CD: GitHub Actions
- Hosting: Vercel (frontend), Render/Heroku (backend), MongoDB Atlas

## Monorepo Structure
```
root/
  backend/
  frontend/
  .github/workflows/
```

## Backend
### Env (.env)
Create `backend/.env` using:
```
PORT=4000
NODE_ENV=development
MONGODB_URI=mongodb+srv://<user>:<pass>@<cluster>/sbms?retryWrites=true&w=majority
JWT_SECRET=replace-with-strong-secret
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:5173,http://localhost:3000
GOOGLE_MAPS_API_KEY=
MAPBOX_ACCESS_TOKEN=
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=
```

### Install & Run
```
cd backend
npm i
npm run dev
```
Seed sample data:
```
npm run seed
```

### API Routes (prefix /api)
- Auth: POST `/auth/signup`, POST `/auth/login`, GET `/auth/me`
- Buses: GET `/buses`, GET `/buses/:id`, POST `/buses` (admin), PUT/DELETE `/buses/:id` (admin)
- Routes: GET `/routes`, GET `/routes/:id`, POST `/routes` (admin), PUT/DELETE `/routes/:id` (admin)
- Locations: POST `/locations` (driver), GET `/locations/:busId/latest`, GET `/locations/:busId/history?limit=100`
- ETA: GET `/eta/:busId/:stopSeq`

## Frontend
### Env (.env)
Create `frontend/.env` using:
```
VITE_API_BASE=http://localhost:4000/api
VITE_GOOGLE_MAPS_API_KEY=
VITE_MAPBOX_ACCESS_TOKEN=
```

### Install & Run
```
cd frontend
npm i
npm run dev
```
Visit `http://localhost:5173`.

### Sample Logins
Seeded users (password: `password123`):
- Admin: `admin@sbms.edu`
- Driver: `driver@sbms.edu`
- Student: `student@sbms.edu`

## Deployment
### Backend (Render/Heroku)
- Set env vars from `backend/.env`
- Start command: `npm start`

### Frontend (Vercel)
- Set `VITE_API_BASE` to your backend URL (e.g., `https://sbms-backend.onrender.com/api`)
- Build command: `npm run build`, Output dir: `dist`

### Database (MongoDB Atlas)
- Create a project and cluster
- Whitelist server IPs
- Create user and obtain connection string for `MONGODB_URI`

## Optional Notifications (Future)
- Integrate Firebase Cloud Messaging for push notifications to students for arrival alerts.

## Optional ML (Future)
- Train a model for ETA improvements based on historical traffic and route timing.

## Development Notes
- Auth uses JWT bearer tokens; clients attach `Authorization: Bearer <token>`
- Drivers post GPS every ~5s to `/locations`
- ETA uses Google/Mapbox Directions API depending on available key


