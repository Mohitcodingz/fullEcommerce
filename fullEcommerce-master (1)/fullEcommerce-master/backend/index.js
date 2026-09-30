require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();

// Railway / proxies: needed for correct protocol + rate limiting behind proxy
app.set('trust proxy', 1);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ---------- CORS ----------
// Set FRONTEND_URL (or CORS_ORIGINS comma-separated) in Railway Variables.
// Falls back to permissive same-origin-friendly defaults for local dev.
const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:5173',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:5173',
    process.env.FRONTEND_URL,
    ...(process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',') : []),
].filter(Boolean).map((o) => o.trim().replace(/\/$/, ''));

app.use(cors({
    origin: (origin, callback) => {
        // Allow same-origin / curl / health checks with no Origin header
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin.replace(/\/$/, ''))) return callback(null, true);
        return callback(null, false);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ---------- Health checks (must NOT require DB) ----------
// Railway health check hits this before Mongo is up, so keep it DB-free.
app.get('/health', (req, res) => res.status(200).json({ status: 'ok' }));
app.get('/api/health', (req, res) => res.status(200).json({
    status: 'ok',
    db: require('mongoose').connection.readyState === 1 ? 'connected' : 'not-connected',
    time: new Date().toISOString(),
}));

// ---------- API routes ----------
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/payments', require('./routes/paymentRoutes'));
app.use('/api/payment', require('./routes/paymentRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));

// Unknown /api route -> JSON 404 (must be after all /api routers)
app.use('/api', (req, res) => {
    res.status(404).json({ message: 'API route not found' });
});

// ---------- Serve frontend (single-service Railway deploy) ----------
const clientBuildPath = path.join(__dirname, '../frontend/dist');
if (fs.existsSync(clientBuildPath)) {
    app.use(express.static(clientBuildPath));
    // SPA fallback: anything that is NOT /api serves index.html.
    // Uses a regex-safe middleware (Express 5 compatible, no '*' string wildcard).
    app.use((req, res, next) => {
        if (req.method !== 'GET') return next();
        if (req.path.startsWith('/api')) return res.status(404).json({ message: 'API route not found' });
        res.sendFile(path.join(clientBuildPath, 'index.html'), (err) => {
            if (err) next(err);
        });
    });
} else {
    console.warn(`Frontend build not found at ${clientBuildPath}. API-only mode.`);
}

// ---------- Global error handler (prevents crashes from throwing inside routes) ----------
/* eslint-disable no-unused-vars */
app.use((err, req, res, next) => {
    console.error('Unhandled route error:', err);
    if (res.headersSent) return next(err);
    res.status(err.status || 500).json({
        message: err.message || 'Internal server error',
        ...(process.env.NODE_ENV === 'development' ? { stack: err.stack } : {}),
    });
});

const PORT = Number(process.env.PORT) || 3000;
const connectDB = require('./config/db');

// Start listening FIRST so Railway health checks pass, then connect DB async.
// Never process.exit on DB failure — keep the process alive so logs + /api/health explain the issue.
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on port ${PORT}`);
    connectDB().then(() => {
        console.log('Database ready');
    }).catch((error) => {
        console.error('Database connection failed (server still running for health checks):', error.message);
        console.error('Fix: set MONGODB_URI (or MONGO_URL) in Railway Variables and redeploy.');
    });
});

process.on('unhandledRejection', (reason) => {
    console.error('Unhandled promise rejection:', reason);
});
process.on('uncaughtException', (err) => {
    console.error('Uncaught exception:', err);
});