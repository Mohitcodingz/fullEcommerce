const mongoose = require('mongoose');
require('dotenv').config();
async function connectDB() {
    try {
        const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URL;
        if (!mongoUri) {
            throw new Error('Set MONGODB_URI or connect a Railway MongoDB service that provides MONGO_URL.');
        }

        await mongoose.connect(mongoUri);
        console.log('MongoDB Connected Successfully')
    }
    catch (error) {
        console.error('MongoDB Connection Failed', error.message)
        throw error
    }
}
module.exports = connectDB;