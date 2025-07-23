import { useState } from 'react';
import { Button, Container, Row, Col, Card } from 'react-bootstrap';
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';
import TaskSummary from '../components/TaskSummary';
import ProgressBadge from '../components/ProgressBadge';

function DashboardPage() {
    const [showTaskForm, setShowTaskForm] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [completionRate, setCompletionRate] = useState(0);
    const [taskCount, setTaskCount] = useState(0);

    const calculateCompletionRate = (tasks) => {
        if (tasks.length === 0) return 0;
        const completedCount = tasks.filter(t => t.completed).length;
        return Math.round((completedCount / tasks.length) * 100);
    };

    const handleTasksLoaded = (tasks) => {
        setCompletionRate(calculateCompletionRate(tasks));
        setTaskCount(tasks.length);
    };

    const triggerRefresh = () => {
        setRefreshTrigger(prev => prev + 1);
    };


    return (
        <Container className="my-4">
            <Row className="mb-4">
                <Col>
                    <h1 className="mb-0">Task Dashboard</h1>
                    <p className="text-muted">Manage your daily tasks efficiently</p>
                </Col>
                <Col className="text-end">
                    <Button
                        variant="primary"
                        onClick={() => setShowTaskForm(true)}
                        className="px-4"
                    >
                        <i className="bi bi-plus-lg me-2"></i>Add New Task
                    </Button>
                </Col>
            </Row>

            <Row className="mb-4">
                <Col md={8}>
                    <TaskSummary refreshTrigger={refreshTrigger} />
                </Col>
                <Col md={4}>
                    <Card className="shadow-sm h-100">
                        <Card.Body className="d-flex flex-column justify-content-center align-items-center">
                            <h5 className="mb-3">Completion Progress</h5>
                            <ProgressBadge progress={completionRate} />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row>
                <Col>
                    <Card className="shadow-sm">
                        <Card.Header className="bg-white">
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <h5 className="mb-0">Your Tasks</h5>
                                    <p className="text-muted mb-0 small">{completionRate}% completed • Sorted by due date</p>
                                </div>
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <TaskList
                                onTasksLoaded={handleTasksLoaded}
                                refreshTrigger={refreshTrigger}
                                onTriggerRefresh={triggerRefresh}
                            />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Task Form Modal */}
            <TaskForm
                show={showTaskForm}
                handleClose={() => setShowTaskForm(false)}
                onSave={triggerRefresh}
            />
        </Container>
    );
}

export default DashboardPage;