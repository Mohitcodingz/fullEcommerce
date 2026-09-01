const mongoose = require('mongoose');
require('dotenv').config();
async function connectDB() {
    try {
        const connect = await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected Successfully')
    }
    catch (error) {
        console.log('MongoDB Connection Failed', error)
    }
}
module.exports = connectDB;