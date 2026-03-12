const dns = require('dns');
const dotenv = require('dotenv');

// Force Node.js to use Google DNS
dns.setServers(['8.8.8.8', '8.8.4.4']);

const result = dotenv.config();

if (result.error) {
    console.error('[Backend Error] Failed to load .env file:', result.error);
} else {
    console.log('[Backend] .env file loaded successfully');
    console.log('[Backend] MONGO_URI in process.env:', process.env.MONGO_URI ? 'FOUND (length ' + process.env.MONGO_URI.length + ')' : 'NOT FOUND');
}

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const blogRoutes = require('./routes/blogRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

// Configure CORS
const corsOptions = {
    origin: function (origin, callback) {
        const allowedOrigins = [
            'http://localhost:5173',
            'http://localhost:3000',
            'http://127.0.0.1:5173',
            'https://nkdigitalhub.store',
            'https://www.nkdigitalhub.store'
        ];
        
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('CORS not allowed'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use('/api/blogs', blogRoutes);
app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
    res.send('API is running...');
});

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'production' ? {} : err.message
    });
});

const PORT = process.env.PORT || 5000;

// Start server with proper async/await
const startServer = async () => {
    try {
        console.log('[Backend] Initializing database connection...');
        await connectDB();
        console.log('[Backend] Database connected successfully!');
        
        app.listen(PORT, () => {
            console.log(`[Backend] Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error('[Backend Error] Failed to start server:', error.message);
        process.exit(1);
    }
};

startServer();

module.exports = app;