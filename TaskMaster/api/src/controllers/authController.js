import User from '../models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Handle user registration
export const register = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password with salt rounds = 10
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user document
        const newUser = new User({
            email,
            password: hashedPassword
        });

        // Save user to database
        await newUser.save();

        // Return success response (without password)
        res.status(201).json({
            message: 'User created successfully',
            user: { email: newUser.email }
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// User login controller
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Compare passwords
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // Return token and user info
        res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                email: user.email
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// User logout controller (placeholder)
export const logout = (req, res) => {
    // In a real app, you would handle token invalidation here
    res.status(200).json({ message: 'Logout successful' });
};