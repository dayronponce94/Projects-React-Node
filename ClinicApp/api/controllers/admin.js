const User = require('../models/User');
const Specialty = require('../models/Specialty');
const Appointment = require('../models/Appointment');
const asyncHandler = require('express-async-handler');
const Availability = require('../models/Availability');
const Notification = require('../models/Notification');



// @desc    Get all doctors
// @route   GET /api/v1/admin/doctors
exports.getDoctors = asyncHandler(async (req, res) => {
    const doctors = await User.find({ role: 'doctor' })
        .select('-password');

    res.status(200).json(doctors);
});

// @desc    Create a new doctor
// @route   POST /api/v1/admin/doctors
exports.createDoctor = asyncHandler(async (req, res) => {
    const { name, email, password, specialty, phone } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ error: 'User already exists' });
    }

    // Create doctor
    const doctor = await User.create({
        name,
        email,
        password,
        role: 'doctor',
        specialty,
        phone
    });

    res.status(201).json({
        _id: doctor._id,
        name: doctor.name,
        email: doctor.email,
        specialty: doctor.specialty,
        phone: doctor.phone
    });
});

// @desc    Update a doctor
// @route   PUT /api/v1/admin/doctors/:id
exports.updateDoctor = asyncHandler(async (req, res) => {
    const doctor = await User.findById(req.params.id);

    if (!doctor || doctor.role !== 'doctor') {
        return res.status(404).json({ error: 'Doctor not found' });
    }

    const { name, email, specialty, phone, isActive } = req.body;

    doctor.name = name || doctor.name;
    doctor.email = email || doctor.email;
    doctor.specialty = specialty || doctor.specialty;
    doctor.phone = phone || doctor.phone;
    doctor.isActive = isActive !== undefined ? isActive : doctor.isActive;

    await doctor.save();

    res.status(200).json({
        _id: doctor._id,
        name: doctor.name,
        email: doctor.email,
        specialty: doctor.specialty,
        phone: doctor.phone,
        isActive: doctor.isActive
    });
});

// @desc    Delete a doctor and associated data
// @route   DELETE /api/v1/admin/doctors/:id
exports.deleteDoctor = asyncHandler(async (req, res) => {
    const doctor = await User.findById(req.params.id);

    if (!doctor || doctor.role !== 'doctor') {
        return res.status(404).json({ error: 'Doctor not found' });
    }

    try {
        await Availability.deleteMany({ doctor: doctor._id });
        await Appointment.deleteMany({ doctor: doctor._id });

        await doctor.deleteOne();

        res.status(200).json({ message: 'Doctor and associated data deleted successfully' });
    } catch (error) {
        console.error('Error deleting doctor and associated data:', error);
        res.status(500).json({ error: 'Failed to delete doctor and associated data' });
    }
});

// @desc    Get all specialties
// @route   GET /api/v1/admin/specialties
exports.getSpecialties = asyncHandler(async (req, res) => {
    const specialties = await Specialty.find();
    res.status(200).json(specialties);
});

// @desc    Create a new specialty
// @route   POST /api/v1/admin/specialties
exports.createSpecialty = asyncHandler(async (req, res) => {
    const { name, description } = req.body;

    const specialty = await Specialty.create({
        name,
        description
    });

    res.status(201).json(specialty);
});

// @desc    Update a specialty
// @route   PUT /api/v1/admin/specialties/:id
exports.updateSpecialty = asyncHandler(async (req, res) => {
    const { name, description } = req.body;
    const specialty = await Specialty.findById(req.params.id);

    if (!specialty) {
        return res.status(404).json({ error: 'Specialty not found' });
    }

    specialty.name = name || specialty.name;
    specialty.description = description || specialty.description;

    await specialty.save();
    res.status(200).json(specialty);
});

// @desc    Delete a specialty
// @route   DELETE /api/v1/admin/specialties/:id
exports.deleteSpecialty = asyncHandler(async (req, res) => {
    const specialty = await Specialty.findById(req.params.id);

    if (!specialty) {
        return res.status(404).json({ error: 'Specialty not found' });
    }

    await specialty.deleteOne();

    res.status(200).json({ message: 'Specialty deleted successfully' });
});

// @desc    Get appointment reports
// @route   GET /api/v1/admin/reports
exports.getAppointmentReports = asyncHandler(async (req, res) => {
    const { period } = req.query; // 'daily', 'weekly', 'monthly'

    const now = new Date();
    let startDate, endDate;

    const utcYear = now.getUTCFullYear();
    const utcMonth = now.getUTCMonth();
    const utcDate = now.getUTCDate();
    const utcDay = now.getUTCDay();

    switch (period) {
        case 'daily':
            startDate = new Date(Date.UTC(utcYear, utcMonth, utcDate, 0, 0, 0, 0));
            endDate = new Date(Date.UTC(utcYear, utcMonth, utcDate, 23, 59, 59, 999));
            break;
        case 'weekly':
            const mondayDiff = utcDay === 0 ? -6 : 1 - utcDay;
            const mondayDate = utcDate + mondayDiff;

            startDate = new Date(Date.UTC(utcYear, utcMonth, mondayDate, 0, 0, 0, 0));
            endDate = new Date(startDate);
            endDate.setUTCDate(startDate.getUTCDate() + 6);
            endDate.setUTCHours(23, 59, 59, 999);
            break;
        case 'monthly':
            startDate = new Date(Date.UTC(utcYear, utcMonth, 1, 0, 0, 0, 0));
            endDate = new Date(Date.UTC(utcYear, utcMonth + 1, 0, 23, 59, 59, 999));
            break;
        default:
            return res.status(400).json({ error: 'Invalid period parameter' });
    }

    const appointments = await Appointment.aggregate([
        {
            $match: {
                date: { $gte: startDate, $lte: endDate }
            }
        },
        {
            $lookup: {
                from: 'users',
                localField: 'doctor',
                foreignField: '_id',
                as: 'doctor'
            }
        },
        { $unwind: '$doctor' },
        {
            $group: {
                _id: {
                    doctor: '$doctor.name',
                    specialty: '$doctor.specialty'
                },
                count: { $sum: 1 },
                confirmed: {
                    $sum: {
                        $cond: [{ $eq: ['$status', 'confirmed'] }, 1, 0]
                    }
                },
                cancelled: {
                    $sum: {
                        $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0]
                    }
                }
            }
        },
        {
            $project: {
                doctor: '$_id.doctor',
                specialty: '$_id.specialty',
                count: 1,
                confirmed: 1,
                cancelled: 1,
                _id: 0
            }
        },
        { $sort: { count: -1 } }
    ]);

    res.status(200).json({
        period,
        startDate,
        endDate,
        appointments
    });
});

// GET /api/v1/admin/notifications
exports.getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find().sort({ timestamp: -1 });
        res.json(notifications);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch notifications' });
    }
};

// PUT /api/v1/admin/notifications/:id/read
exports.markNotificationAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        const notification = await Notification.findByIdAndUpdate(id, { read: true }, { new: true });
        if (!notification) return res.status(404).json({ error: 'Notification not found' });
        res.json(notification);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to update notification' });
    }
};

exports.createNotification = async (type, message) => {
    try {
        const notification = new Notification({ type, message });
        await notification.save();
    } catch (err) {
        console.error('Failed to create notification:', err.message);
    }
};

exports.getSystemStats = asyncHandler(async (req, res) => {
    const activeDoctors = await User.countDocuments({
        role: 'doctor',
        isActive: true
    });

    const now = new Date();
    const todayUTC = new Date(Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate(),
        0, 0, 0, 0
    ));

    const tomorrowUTC = new Date(todayUTC);
    tomorrowUTC.setUTCDate(todayUTC.getUTCDate() + 1);

    const todaysAppointments = await Appointment.countDocuments({
        date: {
            $gte: todayUTC,
            $lt: tomorrowUTC
        }
    });


    const pendingNotifications = await Notification.countDocuments({
        read: false
    });

    res.status(200).json({
        activeDoctors,
        todaysAppointments,
        pendingNotifications
    });
});

// @desc    Set availability for a doctor (admin only)
// @route   POST /api/v1/admin/availability/:doctorId
exports.setWeeklyAvailability = asyncHandler(async (req, res) => {
    const doctorId = req.params.doctorId;
    const availabilityData = req.body;

    if (!Array.isArray(availabilityData)) {
        return res.status(400).json({ error: 'Availability must be an array' });
    }

    const created = [];

    for (const day of availabilityData) {
        const { date, startHour, endHour, slotDuration } = day;

        if (!date || isNaN(new Date(date))) {
            return res.status(400).json({ error: 'Invalid date format' });
        }

        if (
            !/^([01]\d|2[0-3]):[0-5]\d$/.test(startHour) ||
            !/^([01]\d|2[0-3]):[0-5]\d$/.test(endHour) ||
            typeof slotDuration !== 'number' ||
            slotDuration < 5
        ) {
            return res.status(400).json({ error: 'Invalid availability format' });
        }


        const utcDate = new Date(date);
        utcDate.setUTCHours(0, 0, 0, 0);


        const exists = await Availability.findOne({
            doctor: doctorId,
            date: utcDate
        });

        if (!exists) {
            const newAvailability = await Availability.create({
                doctor: doctorId,
                date: utcDate,
                startHour,
                endHour,
                slotDuration,
                active: true
            });
            created.push(newAvailability);
        }
    }

    res.status(201).json({
        success: true,
        message: 'Availability updated',
        availability: created
    });
});

// @desc    Get availability by doctor
// @route   GET /api/v1/admin/availability/by-doctor/:doctorId
exports.getAvailabilityByDoctor = asyncHandler(async (req, res) => {
    const { doctorId } = req.params;

    const availability = await Availability.find({ doctor: doctorId })
        .sort({ date: 1 });

    if (!availability || availability.length === 0) {
        return res.status(404).json({ message: 'No availability found' });
    }

    res.status(200).json(availability);
});

exports.getDoctorById = asyncHandler(async (req, res) => {
    const doctor = await User.findById(req.params.doctorId);

    if (!doctor || doctor.role !== 'doctor') {
        return res.status(404).json({ message: 'Doctor not found' });
    }

    res.status(200).json(doctor);
});

// @desc    Get unread notifications count
// @route   GET /api/v1/admin/notifications/unread-count
exports.getUnreadNotificationsCount = asyncHandler(async (req, res) => {
    try {
        const count = await Notification.countDocuments({ read: false });
        res.status(200).json({ count });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch notifications count' });
    }
});