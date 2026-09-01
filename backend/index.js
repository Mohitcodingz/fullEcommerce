const express = require('express');
const cors = require('cors');
const app = express();
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
app.use(express.json());
app.use(cors());
const env = require('dotenv').config();
app.get('/', (req, res) => {
    res.send('Home Page')
})
app.use('/api/auth', authRoutes);
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    connectDB();
    console.log(`The server is running on http://localhost:${PORT}`)
})