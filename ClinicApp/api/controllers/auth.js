const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const asyncHandler = require('express-async-handler');
const Notification = require('../models/Notification');



// @desc    Register user
// @route   POST /api/v1/auth/register
exports.register = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, role, specialty, adminSecret } = req.body;

    if (role === 'admin') {
        if (!adminSecret || adminSecret !== process.env.ADMIN_SECRET) {
            return res.status(403).json({ error: 'Invalid admin secret code' });
        }
    }

    try {
        // Create user
        const user = await User.create({
            name,
            email,
            password,
            role,
            specialty: role === 'doctor' ? specialty : undefined
        });

        // Create token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRE
        });

        res.status(200).json({ success: true, token });
    } catch (err) {
        // Handle duplicate email
        if (err.code === 11000) {
            return res.status(400).json({ error: 'Email already exists' });
        }
        res.status(500).json({ error: 'Server error' });
    }
};


// @desc    Login user
// @route   POST /api/v1/auth/login
exports.login = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
        // Check if user exists
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Check if password matches
        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Create token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRE
        });

        // Return user data along with token
        res.status(200).json({
            success: true,
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                specialty: user.specialty,
                phone: user.phone
            }
        });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ error: 'Server error' });
    }
};

// @desc    Get current logged in user
// @route   GET /api/v1/auth/me
exports.getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.status(200).json({ success: true, data: user });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};

// @desc    Update user details
// @route   PUT /api/v1/auth/updatedetails
exports.updateDetails = async (req, res) => {
    try {
        const fieldsToUpdate = {
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone
        };

        // Add specialty for doctors
        if (req.user.role === 'doctor') {
            fieldsToUpdate.specialty = req.body.specialty;
        }

        const user = await User.findByIdAndUpdate(
            req.user.id,
            fieldsToUpdate,
            {
                new: true,
                runValidators: true,
                select: '-password'
            }
        );

        const responseData = user.toObject();
        responseData.phone = user.phone;

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};

// @desc    Get user by ID
// @route   GET /api/v1/auth/users/:id
exports.getUserById = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(user);
});