const Notification = require('../models/Notification');
const User = require('../models/User');

exports.createAppointmentNotification = async (action, appointment, user) => {
    try {
        let message = '';

        const doctor = await User.findById(appointment.doctor).select('name');
        const patient = await User.findById(appointment.patient).select('name');

        if (!doctor || !patient) return;

        const actor = user.role === 'doctor' ? `Dr. ${user.name}` : patient.name;
        const target = user.role === 'doctor' ? patient.name : `Dr. ${doctor.name}`;

        switch (action) {
            case 'booked':
                message = `New appointment booked by ${patient.name} with Dr. ${doctor.name}`;
                break;
            case 'cancelled':
                message = `Appointment cancelled by ${actor} with ${target}`;
                break;
            case 'confirmed':
                message = `Dr. ${doctor.name} confirmed appointment with ${patient.name}`;
                break;
            default:
                return;
        }

        const notification = new Notification({
            type: 'appointment',
            message,
        });

        await notification.save();
        console.log(`Notification created: ${message}`);
    } catch (err) {
        console.error('Failed to create notification:', err.message);
    }
};