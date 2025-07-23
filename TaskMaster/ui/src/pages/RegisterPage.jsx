import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../services/authService';
import { Form, Button, Container, Card, Alert } from 'react-bootstrap';

function RegisterPage() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic validation
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            // Call registration service
            await registerUser({
                email: formData.email,
                password: formData.password
            });

            // Reset form and show success
            setFormData({ email: '', password: '', confirmPassword: '' });
            setError('');
            setSuccess(true);

            // Redirect to login after 2 seconds
            setTimeout(() => navigate('/login'), 2000);

        } catch (err) {
            setError(err.message);
            setSuccess(false);
        }
    };

    return (
        <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
            <div className="w-100" style={{ maxWidth: '400px' }}>
                <Card className="shadow-sm">
                    <Card.Body>
                        <h2 className="text-center mb-4 text-primary">TaskMaster</h2>
                        <p className="text-center text-muted">Create a new account</p>

                        {error && <Alert variant="danger">{error}</Alert>}
                        {success && <Alert variant="success">Registration successful! Redirecting to login...</Alert>}

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
                                    placeholder="Password (min. 6 characters)"
                                    value={formData.password}
                                    onChange={handleChange}
                                    minLength={6}
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="confirmPassword">
                                <Form.Label>Confirm Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    name="confirmPassword"
                                    placeholder="Confirm Password"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    minLength={6}
                                    required
                                />
                            </Form.Group>

                            <Button
                                variant="primary"
                                type="submit"
                                className="w-100"
                            >
                                Register
                            </Button>
                        </Form>

                        <div className="mt-3 text-center">
                            <p className="mb-0">
                                Already have an account?{' '}
                                <Link to="/login" className="text-decoration-none">
                                    Log in
                                </Link>
                            </p>
                        </div>
                    </Card.Body>
                </Card>
            </div>
        </Container>
    );
}

export default RegisterPage;