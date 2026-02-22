# Sports Buddy

Sports Buddy is a full-stack sports matchmaking platform built with:
- **Backend:** Node.js + Express + MongoDB + Redis + Socket.io
- **Frontend:** React + Vite

It supports:
- JWT register/login
- user location updates
- sports room creation (date/time, 1–5 km radius, slots)
- nearby room search (MongoDB geospatial queries)
- Redis caching, sessions, and rate-limiting
- atomic room joins with Redis lock
- realtime chat via Socket.io + Redis pub/sub adapter
- room expiry with node-cron

---

## 1) Prerequisites

Install these on your machine:
- Node.js 18+ (or 20+)
- npm 9+
- MongoDB (local or Atlas)
- Redis

---

## 2) Project setup

From repo root:

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env` with your values:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/sports-buddy
REDIS_URL=redis://127.0.0.1:6379
JWT_SECRET=replace-with-a-strong-secret
JWT_EXPIRES_IN=7d
SESSION_SECRET=replace-with-a-strong-session-secret
CLIENT_URL=http://localhost:5173
```

Install dependencies:

```bash
cd backend && npm install
cd ../frontend && npm install
```

---

## 3) Run backend + frontend

Terminal 1 (backend):

```bash
cd backend
npm run dev
```

Terminal 2 (frontend):

```bash
cd frontend
npm run dev
```

Open browser:

- `http://localhost:5173`

---

## 4) What outcome you should see

1. **Auth screen** with register/login form.
2. After login, **Dashboard** appears.
3. Enter `lat` and `lon`, click **Update Location**.
4. Fill room form and click **Create Room**.
5. Click **Find Nearby** to list rooms close to your coordinates.
6. Click **Join** on a room to join it.
7. Joined room opens **Room Chat** and lets you send messages.

---

## 5) Quick API checks (optional)

Health check:

```bash
curl http://localhost:5000/health
```

Register:

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Alice","email":"alice@example.com","password":"password123"}'
```

Login:

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"alice@example.com","password":"password123"}'
```

Nearby rooms:

```bash
curl "http://localhost:5000/api/rooms/nearby?lat=12.9716&lon=77.5946&radiusKm=5"
```

---

## 6) Troubleshooting

- **Port already used**
  - Change frontend port in `frontend/vite.config.js` or backend `PORT` in `.env`.
- **Mongo connection errors**
  - Ensure MongoDB is running and URI is correct.
- **Redis connection errors**
  - Ensure Redis is running on the URL in `.env`.
- **401 Unauthorized**
  - Make sure Authorization header is `Bearer <token>` for protected routes.

---

## 7) Important routes

- `POST /api/auth/register`
- `POST /api/auth/login`
- `PATCH /api/users/location` (JWT)
- `POST /api/rooms` (JWT)
- `GET /api/rooms/nearby?lat=..&lon=..&radiusKm=..`
- `POST /api/rooms/:roomId/join` (JWT)
