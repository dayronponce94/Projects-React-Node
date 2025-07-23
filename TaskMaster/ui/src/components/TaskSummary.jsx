import { useState, useEffect } from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import { getTasks } from '../services/taskService';

function TaskSummary({ refreshTrigger }) {
    const [taskStats, setTaskStats] = useState({
        total: 0,
        completed: 0,
        overdue: 0,
        urgent: 0
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTaskStats = async () => {
            try {
                setLoading(true);
                const tasks = await getTasks();

                const now = new Date();
                const stats = {
                    total: tasks.length,
                    completed: tasks.filter(t => t.completed).length,
                    overdue: tasks.filter(t =>
                        !t.completed && new Date(t.dueDate) < now
                    ).length,
                    urgent: tasks.filter(t =>
                        !t.completed &&
                        new Date(t.dueDate) > now &&
                        (new Date(t.dueDate) - now) < 24 * 60 * 60 * 1000
                    ).length
                };

                setTaskStats(stats);
            } catch (error) {
                console.error('Error fetching task stats:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTaskStats();
    }, [refreshTrigger]);

    if (loading) {
        return (
            <Card className="shadow-sm">
                <Card.Body className="text-center py-4">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </Card.Body>
            </Card>
        );
    }

    return (
        <Card className="shadow-sm">
            <Card.Body>
                <h5 className="mb-3">Task Summary</h5>
                <Row>
                    <Col md={3} className="text-center mb-3 mb-md-0">
                        <div className="fs-2 fw-bold text-primary">{taskStats.total}</div>
                        <div className="text-muted">Total Tasks</div>
                    </Col>
                    <Col md={3} className="text-center mb-3 mb-md-0">
                        <div className="fs-2 fw-bold text-success">{taskStats.completed}</div>
                        <div className="text-muted">Completed</div>
                    </Col>
                    <Col md={3} className="text-center mb-3 mb-md-0">
                        <div className="fs-2 fw-bold text-danger">{taskStats.overdue}</div>
                        <div className="text-muted">Overdue</div>
                    </Col>
                    <Col md={3} className="text-center">
                        <div className="fs-2 fw-bold text-warning">{taskStats.urgent}</div>
                        <div className="text-muted">Urgent</div>
                    </Col>
                </Row>
            </Card.Body>
        </Card>
    );
}

export default TaskSummary;