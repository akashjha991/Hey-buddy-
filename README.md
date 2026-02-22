# Sports Buddy

Sports Buddy is a scalable full-stack sports matchmaking platform using Node.js, Express, MongoDB, Redis, and React.

## Highlights
- JWT authentication with register/login.
- User geo-location update APIs.
- Room creation with date/time, radius (1-5 km), and slot counts.
- Nearby room discovery with MongoDB geospatial `$near` query.
- Redis-powered caching for nearby searches.
- Redis-backed rate limiting and sessions.
- Atomic slot locking with Redis lock + Mongo transaction when joining rooms.
- Socket.io real-time room chat with Redis pub/sub adapter for horizontal scale.
- Auto-expiry of old rooms with `node-cron` and TTL index.
- MVC architecture with validation and security middleware.

## Structure
- `backend/` Express API server.
- `frontend/` React client via Vite.

## Run
1. Copy `backend/.env.example` to `backend/.env` and update values.
2. Install dependencies:
   ```bash
   cd backend && npm install
   cd ../frontend && npm install
   ```
3. Start backend and frontend:
   ```bash
   cd backend && npm run dev
   cd ../frontend && npm run dev
   ```

## Key API routes
- `POST /api/auth/register`
- `POST /api/auth/login`
- `PATCH /api/users/location` (JWT)
- `POST /api/rooms` (JWT)
- `GET /api/rooms/nearby?lat=..&lon=..&radiusKm=..`
- `POST /api/rooms/:roomId/join` (JWT)
