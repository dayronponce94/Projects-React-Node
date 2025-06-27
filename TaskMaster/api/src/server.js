import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import taskRoutes from './routes/taskRoutes.js';

// Load environment variables
dotenv.config();

// Initialize Express application
const app = express();

// Middleware configuration
app.use(cors());
app.use(express.json());


// MongoDB connection setup
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected Successfully');
    } catch (error) {
        console.error('MongoDB Connection Error:', error.message);
        process.exit(1);
    }
};

// Register routes
app.use('/api/auth', authRoutes);  // Add authentication routes

// Define root route
app.get('/', (req, res) => {
    res.send('TaskMaster API is running');
});

// Register task routes
app.use('/api/tasks', taskRoutes);

// Server startup
const PORT = process.env.PORT || 5000;
const startServer = async () => {
    await connectDB();
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
};

startServer();