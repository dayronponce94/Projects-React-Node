import { Routes, Route, Navigate } from 'react-router-dom';
import AppNavbar from './components/Navbar';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import { Container } from 'react-bootstrap';

// Simple protected route component
const ProtectedRoute = ({ children }) => {
  const authToken = localStorage.getItem('authToken');

  if (!authToken) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <AppNavbar />

      <Container className="my-4 flex-grow-1">
        <Routes>
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="*"
            element={<Navigate to="/" replace />}
          />
        </Routes>
      </Container>

      <footer className="bg-light py-3 mt-auto">
        <Container>
          <p className="text-center text-muted mb-0">TaskMaster © 2025</p>
        </Container>
      </footer>
    </div>
  );
}

export default App;