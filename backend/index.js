const express = require('express');
const cors = require('cors');
const app = express();
const connectDB = require('./config/db');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(
    {
        origin: ['http://localhost:3000', 'https://127.0.0.1:3000'],
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization']
    }
));
const env = require('dotenv').config();
app.get('/', (req, res) => {
    res.send('Home Page')
})
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/payments', require('./routes/paymentRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes'))
const PORT = process.env.PORT || 3000

async function startServer() {
    try {
        await connectDB()
        app.listen(PORT, () => {
            console.log(`The server is running on http://localhost:${PORT}`)
        })
    } catch (error) {
        console.error('Server startup failed:', error.message)
        process.exit(1)
    }
}

startServer()