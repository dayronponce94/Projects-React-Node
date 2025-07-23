const User = require('../models/User');
const Specialty = require('../models/Specialty');
const asyncHandler = require('express-async-handler');

// @desc    Get doctors by specialty
// @route   GET /api/v1/users/doctors
exports.getDoctors = asyncHandler(async (req, res) => {
    const { specialty } = req.query;

    const specialtyRegex = new RegExp(`^${specialty}$`, 'i');

    const query = { role: 'doctor' };

    if (specialty) {
        query.specialty = specialtyRegex;
    }

    try {
        const doctors = await User.find(query).select('-password');
        res.status(200).json(doctors);
    } catch (err) {
        console.error('Error fetching doctors:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// @desc    Get all specialties (public)
// @route   GET /api/v1/users/specialties
exports.getSpecialties = asyncHandler(async (req, res) => {
    try {
        const specialties = await Specialty.find();
        res.status(200).json(specialties);
    } catch (err) {
        console.error('Error fetching specialties:', err);
        res.status(500).json({ error: 'Server error' });
    }
});