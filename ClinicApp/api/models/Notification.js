const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['system', 'reminder', 'appointment', 'user'],
        default: 'appointment'
    },
    message: {
        type: String,
        required: true
    },
    read: {
        type: Boolean,
        default: false
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Notification', notificationSchema);
