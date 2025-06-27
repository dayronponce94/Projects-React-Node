import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Container, Nav, Button } from 'react-bootstrap';

function AppNavbar() {
    const navigate = useNavigate();
    const authToken = localStorage.getItem('authToken');
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        navigate('/login');
    };

    return (
        <Navbar bg="light" expand="lg" className="shadow-sm">
            <Container>
                <Navbar.Brand as={Link} to="/" className="fw-bold text-primary">
                    TaskMaster
                </Navbar.Brand>

                <Navbar.Toggle aria-controls="basic-navbar-nav" />

                <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
                    <Nav>
                        {authToken ? (
                            <>
                                <Navbar.Text className="me-3">
                                    Signed in as: <span className="fw-bold">{userData.email}</span>
                                </Navbar.Text>
                                <Button variant="outline-danger" onClick={handleLogout}>
                                    Logout
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button
                                    as={Link}
                                    to="/login"
                                    variant="outline-primary"
                                    className="me-2"
                                >
                                    Login
                                </Button>
                                <Button
                                    as={Link}
                                    to="/register"
                                    variant="primary"
                                >
                                    Register
                                </Button>
                            </>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default AppNavbar;