import express from 'express';
import { register, login, logout } from '../controllers/authController.js';

const router = express.Router();

// POST /api/auth/register - User registration endpoint
router.post('/register', register);

// POST /api/auth/login - User login
router.post('/login', login);

// POST /api/auth/logout - User logout
router.post('/logout', logout);

export default router;