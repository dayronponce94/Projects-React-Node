const express = require('express');
const { protect } = require('../middleware/auth');
const {
    setAvailability,
    getAvailability,
    getAvailableSlots,
    bookAppointment,
    getPatientAppointments,
    cancelAppointment,
    getDoctorAppointments,
    updateAppointmentStatus
} = require('../controllers/appointments');

const router = express.Router();

router.route('/availability')
    .post(protect, setAvailability)

router.route('/availability/:doctorId')
    .get(getAvailability);

router.route('/slots')
    .get(getAvailableSlots);

router.route('/')
    .post(protect, bookAppointment);

router.route('/patient')
    .get(protect, getPatientAppointments);

router.route('/:id/cancel')
    .put(protect, cancelAppointment);

router.route('/doctor')
    .get(protect, getDoctorAppointments);

router.route('/:id/status')
    .put(protect, updateAppointmentStatus);

module.exports = router;