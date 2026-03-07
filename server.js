const dotenv = require('dotenv');
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

// Connect to database
console.log('[Backend] Initializing database connection...');
connectDB();

// Middleware
app.use(cors());
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

if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
