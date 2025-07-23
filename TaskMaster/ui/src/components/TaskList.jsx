import { useEffect, useState, useMemo } from 'react';
import {
    ListGroup,
    Badge,
    Button,
    Dropdown,
    Modal
} from 'react-bootstrap';
import {
    getTasks,
    updateTask,
    deleteTask,
    toggleTaskCompletion
} from '../services/taskService';
import TaskForm from './TaskForm';
import { FaEllipsisV, FaEdit, FaTrash, FaCheck, FaUndo } from 'react-icons/fa';
import TaskFilters from './TaskFilters';

function TaskList({ refreshTrigger, onTasksLoaded, onTriggerRefresh }) {
    const [tasks, setTasks] = useState([]);
    const [filteredTasks, setFilteredTasks] = useState([]);
    const [currentFilter, setCurrentFilter] = useState('all');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showEditModal, setShowEditModal] = useState(false);
    const [currentTask, setCurrentTask] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [taskToDelete, setTaskToDelete] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const tasksPerPage = 5;

    const paginatedTasks = useMemo(() => {
        const startIndex = (currentPage - 1) * tasksPerPage;
        return filteredTasks.slice(startIndex, startIndex + tasksPerPage);
    }, [filteredTasks, currentPage]);

    const totalPages = Math.ceil(filteredTasks.length / tasksPerPage);

    useEffect(() => {
        setCurrentPage(1);
    }, [filteredTasks, refreshTrigger]);

    const loadTasks = async () => {
        try {
            setLoading(true);
            const tasksData = await getTasks();
            setTasks(tasksData);
            setError('');

            if (onTasksLoaded) {
                onTasksLoaded(tasksData);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        loadTasks();
    }, [refreshTrigger]);

    useEffect(() => {
        let result = tasks;

        if (currentFilter === 'completed') {
            result = tasks.filter(task => task.completed);
        } else if (currentFilter === 'incomplete') {
            result = tasks.filter(task => !task.completed);
        }

        setFilteredTasks(result);
    }, [tasks, currentFilter]);

    useEffect(() => {
        const savedFilter = localStorage.getItem('taskFilter');
        if (savedFilter) {
            setCurrentFilter(savedFilter);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('taskFilter', currentFilter);
    }, [currentFilter]);

    const getPriorityVariant = (priority) => {
        switch (priority) {
            case 'High': return 'danger';
            case 'Medium': return 'warning';
            case 'Low': return 'success';
            default: return 'secondary';
        }
    };

    const getStatusVariant = (status) => {
        switch (status) {
            case 'overdue': return 'danger';
            case 'urgent': return 'warning';
            case 'upcoming': return 'info';
            case 'completed': return 'success';
            default: return 'secondary';
        }
    };

    const getStatusText = (status, diffDays) => {
        switch (status) {
            case 'overdue': return `Overdue by ${Math.abs(diffDays)} days`;
            case 'urgent': return 'Due today!';
            case 'upcoming': return `Due in ${diffDays} days`;
            case 'completed': return 'Completed';
            default: return '';
        }
    };

    const handleEditClick = (task) => {
        setCurrentTask(task);
        setShowEditModal(true);
    };

    const handleDeleteClick = (task) => {
        setTaskToDelete(task);
        setShowDeleteModal(true);
    };

    const handleUpdateTask = async (updatedTask) => {
        try {
            await updateTask(updatedTask._id, updatedTask);
            loadTasks();
            onTriggerRefresh();
        } catch (error) {
            console.error('Error updating task:', error);
            setError(error.message);
        }
    };

    const handleDeleteConfirm = async () => {
        try {
            await deleteTask(taskToDelete._id);
            setTaskToDelete(null);
            setShowDeleteModal(false);
            onTriggerRefresh();
            loadTasks();

        } catch (error) {
            console.error('Error deleting task:', error);
            setError(error.message);
        }
    };

    const handleToggleCompletion = async (task) => {
        try {
            await toggleTaskCompletion(task._id);
            loadTasks();
            onTriggerRefresh();
        } catch (error) {
            console.error('Error toggling task status:', error);
            setError(error.message);
        }
    };

    if (loading) {
        return (
            <div className="text-center py-4">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-2">Loading tasks...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="alert alert-danger">
                <p>Error loading tasks: {error}</p>
                <Button variant="primary" onClick={loadTasks}>
                    Try Again
                </Button>
            </div>
        );
    }

    const goToPage = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const renderPagination = () => {
        if (totalPages <= 1) return null;

        return (
            <div className="d-flex justify-content-center mt-4">
                <nav>
                    <ul className="pagination">
                        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                            <button
                                className="page-link"
                                onClick={() => goToPage(currentPage - 1)}
                            >
                                &laquo; Previous
                            </button>
                        </li>

                        {[...Array(totalPages)].map((_, i) => (
                            <li
                                key={i}
                                className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}
                            >
                                <button
                                    className="page-link"
                                    onClick={() => goToPage(i + 1)}
                                >
                                    {i + 1}
                                </button>
                            </li>
                        ))}

                        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                            <button
                                className="page-link"
                                onClick={() => goToPage(currentPage + 1)}
                            >
                                Next &raquo;
                            </button>
                        </li>
                    </ul>
                </nav>
            </div>
        );
    };

    return (
        <div>
            <TaskFilters
                currentFilter={currentFilter}
                onFilterChange={setCurrentFilter}
            />
            <div className="d-flex justify-content-between mb-2">
                <small className="text-muted">
                    Showing {filteredTasks.length > 0 ? (currentPage - 1) * tasksPerPage + 1 : 0} -{' '}
                    {Math.min(currentPage * tasksPerPage, filteredTasks.length)} of {filteredTasks.length} tasks
                </small>
                <small className="text-muted">
                    Page {currentPage} of {totalPages}
                </small>
                <small className="text-muted">
                    Filter: {currentFilter}
                </small>
            </div>

            {loading ? (
                <div className="text-center py-4">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-2">Loading tasks...</p>
                </div>
            ) : error ? (
                <div className="alert alert-danger">
                    <p>Error loading tasks: {error}</p>
                    <Button variant="primary" onClick={loadTasks}>
                        Try Again
                    </Button>
                </div>
            ) : filteredTasks.length === 0 ? (
                <div className="text-center py-4">
                    <p className="text-muted">No tasks found with the current filter</p>
                </div>
            ) : (
                <>
                    <ListGroup>
                        {paginatedTasks.map(task => (
                            <ListGroup.Item
                                key={task._id}
                                className={`d-flex justify-content-between align-items-start ${task.completed ? 'bg-light bg-opacity-50' : ''
                                    }`}
                            >
                                <div className="ms-2 me-auto flex-grow-1">
                                    <div className="d-flex align-items-center">
                                        <Button
                                            variant="link"
                                            className="p-0 me-2"
                                            onClick={() => handleToggleCompletion(task)}
                                            title={task.completed ? "Mark as incomplete" : "Mark as complete"}
                                        >
                                            {task.completed ? (
                                                <div className="bg-success text-white rounded-circle d-flex align-items-center justify-content-center"
                                                    style={{ width: '1.5em', height: '1.5em' }}>
                                                    <FaCheck size={12} />
                                                </div>
                                            ) : (
                                                <div className="border border-gray rounded-circle"
                                                    style={{ width: '1.5em', height: '1.5em' }} />
                                            )}
                                        </Button>

                                        <div>
                                            <h5
                                                className={`mb-1 ${task.completed ? 'text-decoration-line-through text-muted' : ''}`}
                                            >
                                                {task.title}
                                            </h5>
                                            <p className="mb-1">{task.description}</p>
                                        </div>
                                    </div>

                                    <div className="d-flex align-items-center mt-2">
                                        <Badge bg={getPriorityVariant(task.priority)} className="me-2">
                                            {task.priority}
                                        </Badge>
                                        <small className="text-muted me-2">
                                            Due: {new Date(task.dueDate).toLocaleDateString()}
                                        </small>
                                        <Badge bg={getStatusVariant(task.status)}>
                                            {getStatusText(task.status, task.diffDays)}
                                        </Badge>
                                    </div>

                                    {task.completed && task.completedAt && (
                                        <small className="d-block text-success mt-1">
                                            Completed on: {new Date(task.completedAt).toLocaleDateString()} at{' '}
                                            {new Date(task.completedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </small>
                                    )}
                                </div>

                                <Dropdown>
                                    <Dropdown.Toggle variant="link" className="text-dark p-0">
                                        <FaEllipsisV />
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu style={{ zIndex: 1000 }}>
                                        <Dropdown.Item onClick={() => handleEditClick(task)}>
                                            <FaEdit className="me-2" /> Edit
                                        </Dropdown.Item>
                                        <Dropdown.Item onClick={() => handleDeleteClick(task)}>
                                            <FaTrash className="me-2" /> Delete
                                        </Dropdown.Item>
                                        <Dropdown.Item onClick={() => handleToggleCompletion(task)}>
                                            {task.completed ? (
                                                <><FaUndo className="me-2" /> Mark Incomplete</>
                                            ) : (
                                                <><FaCheck className="me-2" /> Mark Complete</>
                                            )}
                                        </Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>

                    {renderPagination()}
                </>
            )}

            {/* Edit Task Modal */}
            <TaskForm
                show={showEditModal}
                handleClose={() => setShowEditModal(false)}
                task={currentTask}
                onSave={handleUpdateTask}
            />

            {/* Delete Confirmation Modal */}
            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Delete</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Are you sure you want to delete this task?</p>
                    <p className="fw-bold">"{taskToDelete?.title}"</p>
                    <p className="text-danger">This action cannot be undone.</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={handleDeleteConfirm}>
                        Delete Task
                    </Button>
                </Modal.Footer>
            </Modal>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={() => setCurrentFilter('all')}
                >
                    Clear Filter
                </Button>
            </div>
        </div>
    );
}

export default TaskList;