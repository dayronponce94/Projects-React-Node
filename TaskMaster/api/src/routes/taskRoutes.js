import express from 'express';
import { createTask, getTasks, updateTask, deleteTask, toggleTaskCompletion } from '../controllers/taskController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply authMiddleware to all task routes
router.use(authMiddleware);

// POST /api/tasks - Create a new task
router.post('/', createTask);

// GET /api/tasks - Get all tasks for the user
router.get('/', getTasks);

// New routes for update and delete
router.patch('/:id', updateTask); // PATCH /api/tasks/:id
router.delete('/:id', deleteTask); // DELETE /api/tasks/:id

router.patch('/:id/toggle-completion', toggleTaskCompletion);

export default router;