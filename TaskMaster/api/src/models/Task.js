import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    dueDate: {
        type: Date,
        required: true
    },
    priority: {
        type: String,
        enum: ['High', 'Medium', 'Low'],
        default: 'Medium'
    },
    completed: {
        type: Boolean,
        default: false
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    completedAt: {
        type: Date
    }
}, {
    timestamps: true
});

export default mongoose.model('Task', taskSchema);
