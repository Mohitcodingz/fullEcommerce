const express = require('express');
const cors = require('cors');
const app = express();
const connectDB = require('./config/db');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
const env = require('dotenv').config();
app.get('/', (req, res) => {
    res.send('Home Page')
})
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRouter'));
// app.use('/api/orders', require('./routes/orderRoutes'));
// app.use('/api/payments', require('./routes/paymentRoutes'));
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    connectDB();
    console.log(`The server is running on http://localhost:${PORT}`)
})