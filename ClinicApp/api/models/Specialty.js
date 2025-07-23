const mongoose = require('mongoose');

const SpecialtySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a specialty name'],
        unique: true
    },
    description: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Specialty', SpecialtySchema);