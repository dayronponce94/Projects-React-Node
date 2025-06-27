import { useState, useEffect } from 'react';
import { Form, Button, Modal } from 'react-bootstrap';
import { createTask, updateTask } from '../services/taskService';

function TaskForm({ show, handleClose, task, onSave }) {
    const isEditing = !!task;

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        dueDate: '',
        priority: 'Medium'
    });

    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Initialize form with task data when editing
    useEffect(() => {
        if (task) {
            // Format date for input field (YYYY-MM-DD)
            const dueDate = new Date(task.dueDate);
            const formattedDate = dueDate.toISOString().split('T')[0];

            setFormData({
                title: task.title,
                description: task.description || '',
                dueDate: formattedDate,
                priority: task.priority
            });
        } else {
            // Reset form for new task
            setFormData({
                title: '',
                description: '',
                dueDate: '',
                priority: 'Medium'
            });
        }
    }, [task, show]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            // For editing, call updateTask
            if (isEditing) {
                await onSave({
                    ...formData,
                    _id: task._id
                });
            }
            // For new task, call createTask
            else {
                const response = await createTask(formData);
                onSave(response.task);
            }

            // Close modal
            handleClose();

        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>
                    {isEditing ? 'Edit Task' : 'Create New Task'}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {error && <p className="text-danger">{error}</p>}
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="title">
                        <Form.Label>Title</Form.Label>
                        <Form.Control
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="description">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="dueDate">
                        <Form.Label>Due Date</Form.Label>
                        <Form.Control
                            type="date"
                            name="dueDate"
                            value={formData.dueDate}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="priority">
                        <Form.Label>Priority</Form.Label>
                        <Form.Select
                            name="priority"
                            value={formData.priority}
                            onChange={handleChange}
                        >
                            <option value="High">High</option>
                            <option value="Medium">Medium</option>
                            <option value="Low">Low</option>
                        </Form.Select>
                    </Form.Group>

                    <div className="d-grid mt-4">
                        <Button
                            variant="primary"
                            type="submit"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <span>
                                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                    {isEditing ? 'Saving...' : 'Creating...'}
                                </span>
                            ) : (
                                isEditing ? 'Save Changes' : 'Create Task'
                            )}
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
}

export default TaskForm;