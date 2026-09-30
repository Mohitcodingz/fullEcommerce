const mongoose = require('mongoose');

async function connectDB() {
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URL;
    if (!mongoUri) {
        throw new Error('Set MONGODB_URI or connect a Railway MongoDB service that provides MONGO_URL.');
    }

    // Avoid buffering commands forever when DB is down (causes Railway timeouts)
    mongoose.set('bufferCommands', false);
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 10000 });
    console.log('MongoDB Connected Successfully');
}

module.exports = connectDB;