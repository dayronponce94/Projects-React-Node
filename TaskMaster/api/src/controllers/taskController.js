import Task from '../models/Task.js';

// Create a new task
export const createTask = async (req, res) => {
    try {
        const { title, description, dueDate, priority } = req.body;

        // Create new task
        const task = new Task({
            title,
            description,
            dueDate,
            priority,
            user: req.user.userId // Set from authentication middleware
        });

        // Save task to database
        await task.save();

        // Return success response
        res.status(201).json({
            message: 'Task created successfully',
            task
        });

    } catch (error) {
        console.error('Error creating task:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


// Get all tasks for the logged-in user sorted by due date
export const getTasks = async (req, res) => {
    try {
        // Get tasks sorted by dueDate (ascending) and priority (High first)
        const tasks = await Task.find({ user: req.user.userId })
            .sort({ dueDate: 1, priority: -1 }) // 1 = ascending, -1 = descending
            .lean(); // Convert to plain JavaScript objects

        // Calculate status for each task
        const now = new Date();
        const tasksWithStatus = tasks.map(task => {
            const dueDate = new Date(task.dueDate);
            const diffDays = Math.ceil((dueDate - now) / (1000 * 60 * 60 * 24));

            let status = 'normal';
            if (task.completed) {
                status = 'completed';
            } else if (diffDays < 0) {
                status = 'overdue';
            } else if (diffDays <= 1) {
                status = 'urgent';
            } else if (diffDays <= 3) {
                status = 'upcoming';
            }

            return {
                ...task,
                status,
                diffDays
            };
        });

        res.status(200).json(tasksWithStatus);

    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Update a task
export const updateTask = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        // Find task and update
        const updatedTask = await Task.findOneAndUpdate(
            { _id: id, user: req.user.userId }, // Ensure user owns the task
            updateData,
            { new: true, runValidators: true } // Return updated task and validate
        );

        if (!updatedTask) {
            return res.status(404).json({ message: 'Task not found' });
        }

        res.status(200).json({
            message: 'Task updated successfully',
            task: updatedTask
        });

    } catch (error) {
        console.error('Error updating task:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Delete a task
export const deleteTask = async (req, res) => {
    try {
        const { id } = req.params;

        // Find task and delete
        const deletedTask = await Task.findOneAndDelete({
            _id: id,
            user: req.user.userId // Ensure user owns the task
        });

        if (!deletedTask) {
            return res.status(404).json({ message: 'Task not found' });
        }

        res.status(200).json({
            message: 'Task deleted successfully',
            taskId: id
        });

    } catch (error) {
        console.error('Error deleting task:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Toggle task completion status
export const toggleTaskCompletion = async (req, res) => {
    try {
        const { id } = req.params;

        // Find the task
        const task = await Task.findOne({
            _id: id,
            user: req.user.userId
        });

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Toggle completion status and set completion time
        task.completed = !task.completed;
        task.completedAt = task.completed ? new Date() : null;

        // Save updated task
        const updatedTask = await task.save();

        res.status(200).json({
            message: `Task marked as ${task.completed ? 'completed' : 'incomplete'}`,
            task: updatedTask
        });

    } catch (error) {
        console.error('Error toggling task completion:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};