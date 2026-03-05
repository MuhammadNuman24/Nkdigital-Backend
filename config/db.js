require('dotenv').config();
const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const uri = process.env.MONGO_URI;
        if (!uri) {
            throw new Error('MONGO_URI is not defined in environment variables');
        }

        // Basic validation for SRV string
        if (uri.startsWith('mongodb+srv://') && !uri.includes('@')) {
            throw new Error('Invalid MONGO_URI: Missing host address or "@" character. Please copy the FULL string from MongoDB Atlas.');
        }

        const conn = await mongoose.connect(uri);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Database Connection Error: ${error.message}`);
        throw error;
    }
};

module.exports = connectDB;
