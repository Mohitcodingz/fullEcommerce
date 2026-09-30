# Railway deploy runbook (single service: backend serves frontend build)

## 1) Railway service setup
- Root Directory: repository root (where root package.json is)
- Build Command: npm run build
- Start Command: npm start
- Healthcheck Path: /health
- Node: 20 (nixpacks.toml pins nodejs-20_x, root engines >= 20.19.0)

## 2) Variables (Railway > Service > Variables)
PORT=<provided by Railway automatically>
NODE_ENV=production
MONGODB_URI=mongodb+srv://...  (or MONGO_URL if using Railway Mongo plugin)
JWT_SECRET=<long random string>
RESEND_API_KEY=re_...
SENDER_EMAIL=YBags <onboarding@resend.dev>
FRONTEND_URL=https://<your-service>.up.railway.app
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
CASHFREE_API_KEY=... (optional)
CASHFREE_API_SECRET=... (optional)
CASHFREE_ENV=SANDBOX

Notes:
- SENDER_EMAIL must be a verified sender/domain in Resend. For testing use
  onboarding@resend.dev (only sends to the Resend account email).
- Resend free tier can take a few minutes; OTP is valid for 10 minutes.
- If email is not configured, /api/auth/register returns 503 with a clear
  message instead of crashing.
- If Mongo is down, the server still listens (so /health passes) and
  /api/health reports db:not-connected. Check logs for the exact reason.

## 3) Verify after deploy
- GET /health -> { status: ok }
- GET /api/health -> { status: ok, db: connected }
- POST /api/auth/register -> 201 + "check your email for verification OTP"
- POST /api/auth/verifyOtp -> 200 + token
- Frontend served from / (backend serves frontend/dist)

## 4) Common Railway crash causes fixed in this repo
- backend/index.js used `app.get(/.*/)` + Express 5 + `process.exit(1)` on DB
  failure -> changed to listen-first, DB-async, Express-4-compatible fallback.
- Missing `const mongoose = require('mongoose')` in backend/model/order.js
  (ReferenceError crash on boot).
- Multer disk uploads (`uploads/`) fail on Railway ephemeral FS -> memory
  storage + Cloudinary upload_stream.
- Resend SDK v4 returns { data, error } (never throws on API errors) ->
  sendEmail now checks `error` explicitly; OTP no longer deleted on email
  failure, returns 503 instead.
- Frontend Register.jsx logged the user in immediately without OTP ->
  now goes to verify-otp step; Login handles 403 needsVerification.
- Duplicate root deps + express@5/mongoose@9 downgraded to stable
  express@4 + mongoose@7 for Railway builds.
