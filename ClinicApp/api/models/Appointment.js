const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: Date,
        required: true,
        index: true
    },
    startTime: {
        type: String,
        required: true,
        match: /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/
    },
    endTime: {
        type: String,
        required: true,
        match: /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'cancelled', 'completed'],
        default: 'pending'
    },
    notes: {
        type: String,
        default: ''
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

AppointmentSchema.index({ doctor: 1, date: 1, startTime: 1 });

module.exports = mongoose.model('Appointment', AppointmentSchema);