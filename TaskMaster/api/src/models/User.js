import mongoose from 'mongoose';

// User schema definition
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,  // Ensures email uniqueness
        trim: true,    // Removes whitespace
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6   // Minimum password length
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Export User model
export default mongoose.model('User', userSchema);
