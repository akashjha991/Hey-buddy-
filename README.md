# Sports Buddy

Sports Buddy is a full-stack sports matchmaking platform built with:
- **Backend:** Node.js + Express + MongoDB + Redis + Socket.io
- **Frontend:** React + Vite

---

## Local Run (Quick)

### 1) Prerequisites
- Node.js 18+
- npm 9+
- MongoDB
- Redis

### 2) Setup
```bash
cd backend
cp .env.example .env
```

Then install deps:
```bash
cd backend && npm install
cd ../frontend && npm install
```

### 3) Start
Terminal 1:
```bash
cd backend
npm run dev
```

Terminal 2:
```bash
cd frontend
npm run dev
```

Open: `http://localhost:5173`

---

## Deploy Frontend on Vercel + Backend on Free Hosting

Below is the easiest production setup:
- **Frontend:** Vercel (free)
- **Backend:** Render Web Service (free tier available; may spin down)
- **Database:** MongoDB Atlas (free M0)
- **Redis:** Upstash Redis (free)

> You can also use Railway/Fly.io for backend if you prefer. Steps below use Render because it is straightforward.

### A) Prepare managed services

#### 1. MongoDB Atlas (free)
1. Create Atlas cluster (M0 free).
2. Create DB user and password.
3. Whitelist IP (`0.0.0.0/0` for quick start, restrict later).
4. Copy connection string and set as `MONGO_URI`.

#### 2. Upstash Redis (free)
1. Create Redis database.
2. Copy Redis URL (`redis://...`) and set as `REDIS_URL`.

### B) Deploy backend to Render

1. Push repo to GitHub.
2. In Render: **New > Web Service**.
3. Connect repo.
4. Settings:
   - Runtime: **Node**
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm start`
5. Add Environment Variables:
   - `PORT=5000`
   - `NODE_ENV=production`
   - `MONGO_URI=<atlas-uri>`
   - `REDIS_URL=<upstash-redis-uri>`
   - `JWT_SECRET=<strong-secret>`
   - `JWT_EXPIRES_IN=7d`
   - `SESSION_SECRET=<strong-secret>`
   - `CLIENT_URL=<your-vercel-app-url>`
   - `CLIENT_URLS=<your-vercel-app-url>,http://localhost:5173`
6. Deploy and copy your backend URL, for example:
   - `https://sports-buddy-api.onrender.com`

Health check:
```bash
curl https://sports-buddy-api.onrender.com/health
```

### C) Deploy frontend to Vercel

1. In Vercel: **Add New > Project**.
2. Import same GitHub repo.
3. Set **Root Directory** to `frontend`.
4. Framework preset: **Vite**.
5. Add environment variables:
   - `VITE_API_BASE_URL=https://sports-buddy-api.onrender.com/api`
   - `VITE_SOCKET_URL=https://sports-buddy-api.onrender.com`
6. Deploy.

### D) Final CORS alignment

After Vercel gives your URL (example `https://sports-buddy.vercel.app`), update backend env in Render:
- `CLIENT_URL=https://sports-buddy.vercel.app`
- `CLIENT_URLS=https://sports-buddy.vercel.app,http://localhost:5173`

Redeploy backend once after this change.

---

## Production Notes

- Render free instances may sleep; first request can be slow.
- Cookies are set with secure defaults in production (`secure` + `sameSite=none`).
- Frontend now uses env-driven URLs:
  - `VITE_API_BASE_URL`
  - `VITE_SOCKET_URL`
- Backend accepts multiple frontend origins from `CLIENT_URLS`.

---

## Important API routes
- `POST /api/auth/register`
- `POST /api/auth/login`
- `PATCH /api/users/location` (JWT)
- `POST /api/rooms` (JWT)
- `GET /api/rooms/nearby?lat=..&lon=..&radiusKm=..`
- `POST /api/rooms/:roomId/join` (JWT)
