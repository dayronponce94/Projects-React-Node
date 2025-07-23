const mongoose = require('mongoose');

const AvailabilitySchema = new mongoose.Schema({
    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    startHour: {
        type: String,
        required: true
    },
    endHour: {
        type: String,
        required: true
    },
    slotDuration: {
        type: Number,
        default: 30
    },
    active: {
        type: Boolean,
        default: true
    }
});

module.exports = mongoose.model('Availability', AvailabilitySchema);