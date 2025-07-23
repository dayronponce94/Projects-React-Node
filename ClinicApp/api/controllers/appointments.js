const Appointment = require('../models/Appointment');
const Availability = require('../models/Availability');
const asyncHandler = require('express-async-handler');
const Notification = require('../models/Notification');
const { createAppointmentNotification } = require('../utils/notificationHelper');

// @desc    Set doctor availability
// @route   POST /api/v1/appointments/availability
exports.setAvailability = asyncHandler(async (req, res) => {
    if (req.user.role !== 'doctor') {
        return res.status(403).json({ error: 'Only doctors can set availability' });
    }

    const { dayOfWeek, startHour, endHour, slotDuration } = req.body;

    const availability = await Availability.create({
        doctor: req.user.id,
        dayOfWeek,
        startHour,
        endHour,
        slotDuration
    });

    res.status(201).json(availability);
});

// @desc    Get doctor availability
// @route   GET /api/v1/appointments/availability/:doctorId
exports.getAvailability = asyncHandler(async (req, res) => {
    const availabilities = await Availability.find({
        doctor: req.params.doctorId,
        active: true
    });

    res.status(200).json(availabilities);
});

// @desc    Get available slots for a doctor on a specific date
// @route   GET /api/v1/appointments/slots
exports.getAvailableSlots = asyncHandler(async (req, res) => {
    const { doctorId, date } = req.query;

    if (!doctorId || !date) {
        return res.status(400).json({ error: 'Doctor ID and date are required' });
    }

    const selectedDate = new Date(date);
    selectedDate.setUTCHours(0, 0, 0, 0);

    const availability = await Availability.findOne({
        doctor: doctorId,
        date: selectedDate,
        active: true
    });

    if (!availability) {
        return res.status(200).json([]);
    }

    const startOfDay = new Date(selectedDate);
    startOfDay.setUTCHours(0, 0, 0, 0);

    const endOfDay = new Date(selectedDate);
    endOfDay.setUTCHours(23, 59, 59, 999);

    const appointments = await Appointment.find({
        doctor: doctorId,
        date: {
            $gte: startOfDay,
            $lte: endOfDay
        }
    });

    const slots = generateTimeSlots(
        availability.startHour,
        availability.endHour,
        availability.slotDuration,
        appointments
    );

    res.status(200).json(slots);
});

// @desc    Book an appointment
// @route   POST /api/v1/appointments
exports.bookAppointment = asyncHandler(async (req, res) => {
    const { doctorId, date, startTime, endTime } = req.body;

    if (!doctorId || !date || !startTime || !endTime) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    const appointmentDate = new Date(date);
    appointmentDate.setUTCHours(0, 0, 0, 0);


    const existingAppointment = await Appointment.findOne({
        doctor: doctorId,
        date: appointmentDate,
        startTime: startTime
    });

    if (existingAppointment) {
        return res.status(400).json({ error: 'Slot is no longer available' });
    }


    const appointment = await Appointment.create({
        doctor: doctorId,
        patient: req.user.id,
        date: appointmentDate,
        startTime,
        endTime,
        status: 'pending'
    });
    await createAppointmentNotification('booked', appointment, req.user);

    res.status(201).json(appointment);
});

function generateTimeSlots(start, end, duration, existingAppointments) {
    const slots = [];
    const [startHour, startMinute] = start.split(':').map(Number);
    const [endHour, endMinute] = end.split(':').map(Number);

    let currentHour = startHour;
    let currentMinute = startMinute;

    const startTimeInMinutes = startHour * 60 + startMinute;
    const endTimeInMinutes = endHour * 60 + endMinute;

    let currentTimeInMinutes = startTimeInMinutes;

    while (currentTimeInMinutes < endTimeInMinutes) {
        const startHours = Math.floor(currentTimeInMinutes / 60);
        const startMinutes = currentTimeInMinutes % 60;
        const startTime = `${startHours.toString().padStart(2, '0')}:${startMinutes.toString().padStart(2, '0')}`;

        const endTimeInMinutes = currentTimeInMinutes + duration;
        const endHours = Math.floor(endTimeInMinutes / 60);
        const endMinutes = endTimeInMinutes % 60;
        const endTime = `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`;

        const isBooked = existingAppointments.some(app =>
            app.startTime === startTime
        );

        slots.push({
            startTime: startTime,
            endTime: endTime,
            available: !isBooked
        });

        currentTimeInMinutes += duration;
    }

    return slots;
}

// @desc    Get appointments for a patient
// @route   GET /api/v1/appointments/patient
exports.getPatientAppointments = asyncHandler(async (req, res) => {
    const appointments = await Appointment.find({
        patient: req.user.id
    })
        .populate('doctor', 'name specialty')
        .sort({ date: 1, startTime: 1 });

    res.status(200).json(appointments);
});

// @desc    Cancel an appointment
// @route   PUT /api/v1/appointments/:id/cancel
exports.cancelAppointment = asyncHandler(async (req, res) => {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
        return res.status(404).json({ error: 'Appointment not found' });
    }

    if (appointment.patient.toString() !== req.user.id) {
        return res.status(403).json({ error: 'Not authorized to cancel this appointment' });
    }

    if (!['pending', 'confirmed'].includes(appointment.status)) {
        return res.status(400).json({ error: 'Appointment cannot be cancelled' });
    }

    appointment.status = 'cancelled';
    await appointment.save();

    await createAppointmentNotification('cancelled', appointment, req.user);

    res.status(200).json({
        success: true,
        message: 'Appointment cancelled successfully'
    });
});

// @desc    Get doctor's appointments for a specific day
// @route   GET /api/v1/appointments/doctor
exports.getDoctorAppointments = asyncHandler(async (req, res) => {
    if (req.user.role !== 'doctor') {
        return res.status(403).json({ error: 'Only doctors can access this resource' });
    }

    const { date } = req.query;
    if (!date) {
        return res.status(400).json({ error: 'Date parameter is required' });
    }

    const startDate = new Date(date);
    startDate.setUTCHours(0, 0, 0, 0);

    const endDate = new Date(date);
    endDate.setUTCHours(23, 59, 59, 999);

    const appointments = await Appointment.find({
        doctor: req.user.id,
        date: {
            $gte: startDate,
            $lte: endDate
        }
    })
        .populate('patient', 'name email phone')
        .sort({ startTime: 1 });

    res.status(200).json(appointments);
});

// @desc    Update appointment status (for doctors)
// @route   PUT /api/v1/appointments/:id/status
exports.updateAppointmentStatus = asyncHandler(async (req, res) => {
    const { status } = req.body;
    const validStatuses = ['pending', 'confirmed', 'cancelled', 'completed'];

    if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: 'Invalid status value' });
    }

    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
        return res.status(404).json({ error: 'Appointment not found' });
    }

    if (appointment.doctor.toString() !== req.user.id) {
        return res.status(403).json({ error: 'Not authorized to update this appointment' });
    }

    appointment.status = status;
    await appointment.save();

    if (status === 'confirmed') {
        await createAppointmentNotification('confirmed', appointment, req.user);
    } else if (status === 'cancelled') {

        await createAppointmentNotification('cancelled', appointment, req.user);
    }

    res.status(200).json({
        success: true,
        data: appointment
    });
});