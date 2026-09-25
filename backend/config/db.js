const mongoose = require('mongoose');
require('dotenv').config();
async function connectDB() {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error('MONGODB_URI is missing in backend/.env');
        }

        const connect = await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected Successfully')
    }
    catch (error) {
        console.error('MongoDB Connection Failed', error.message)
        throw error
    }
}
module.exports = connectDB;