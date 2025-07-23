const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const {
    getDoctors,
    createDoctor,
    updateDoctor,
    deleteDoctor,
    getSpecialties,
    createSpecialty,
    getAppointmentReports,
    getNotifications,
    updateSpecialty,
    deleteSpecialty,
    getSystemStats,
    setWeeklyAvailability,
    getAvailabilityByDoctor,
    getDoctorById,
    markNotificationAsRead,
    getUnreadNotificationsCount
} = require('../controllers/admin');


const router = express.Router();

// Admin routes require admin role
router.use(protect, authorize('admin'));

router.route('/doctors')
    .get(getDoctors)
    .post(createDoctor);

router.route('/doctors/:id')
    .put(updateDoctor)
    .delete(deleteDoctor);


router.route('/specialties')
    .get(getSpecialties)
    .post(createSpecialty);

router.route('/reports')
    .get(getAppointmentReports);

router.get('/notifications', protect, authorize('admin'), getNotifications);
router.put('/notifications/:id/read', protect, authorize('admin'), markNotificationAsRead);

router.route('/stats')
    .get(getSystemStats);

router.route('/specialties/:id')
    .put(updateSpecialty);

router.route('/specialties/:id')
    .delete(deleteSpecialty);

router.route('/availability/:doctorId')
    .post(setWeeklyAvailability);

router.get('/availability/by-doctor/:doctorId', getAvailabilityByDoctor);

router.get('/doctors/:doctorId', getDoctorById);

router.get('/notifications/unread-count', protect, authorize('admin'), getUnreadNotificationsCount);
module.exports = router;