import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../services/authService';
import { Form, Button, Container, Card, Alert } from 'react-bootstrap';

function LoginPage() {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

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
            const response = await loginUser(formData);

            // Save token and user data in localStorage
            localStorage.setItem('authToken', response.token);
            localStorage.setItem('userData', JSON.stringify(response.user));

            // Redirect to dashboard
            navigate('/');

        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
            <div className="w-100" style={{ maxWidth: '400px' }}>
                <Card className="shadow-sm">
                    <Card.Body>
                        <h2 className="text-center mb-4 text-primary">TaskMaster</h2>
                        <p className="text-center text-muted">Sign in to your account</p>

                        {error && <Alert variant="danger">{error}</Alert>}

                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-3" controlId="email">
                                <Form.Label>Email address</Form.Label>
                                <Form.Control
                                    type="email"
                                    name="email"
                                    placeholder="Enter email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="password">
                                <Form.Label>Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    name="password"
                                    placeholder="Password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>

                            <Button
                                variant="primary"
                                type="submit"
                                className="w-100"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Signing in...' : 'Sign in'}
                            </Button>
                        </Form>

                        <div className="mt-3 text-center">
                            <p className="mb-0">
                                Don't have an account?{' '}
                                <Link to="/register" className="text-decoration-none">
                                    Register
                                </Link>
                            </p>
                        </div>
                    </Card.Body>
                </Card>
            </div>
        </Container>
    );
}

export default LoginPage;