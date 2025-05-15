// src/components/auth/Login.jsx
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Container, Form, Button, Card, Alert, Spinner } from 'react-bootstrap';
import './Auth.css';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, loading: authLoading } = useAuth(); // Renamed to avoid conflict
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/"; // Get redirect path or default to home

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!username || !password) {
      setError('Please enter both username and password.');
      return;
    }

    try {
      const result = await login(username, password);
      if (result.success) {
        // Navigate based on role, or to the 'from' location if specified
        if (location.state?.from) {
            navigate(location.state.from.pathname, { replace: true });
        } else {
            switch (result.user.role) {
                case 'admin':
                    navigate('/admin', { replace: true });
                    break;
                case 'faculty':
                    navigate('/faculty', { replace: true });
                    break;
                default:
                    navigate('/dashboard', { replace: true });
            }
        }
      } else {
        setError(result.message || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      console.error("Login error:", err);
      setError('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <div className="auth-page">
      <Container className="d-flex align-items-center justify-content-center">
        <div className="w-100" style={{ maxWidth: '400px' }}>
          <Card className="auth-card shadow">
            <Card.Body className="p-4 p-md-5">
              <h2 className="text-center mb-4 fw-bold">
                <i className="fas fa-sign-in-alt me-2 text-primary"></i>Log In
              </h2>
              {error && <Alert variant="danger" className="text-center small">{error}</Alert>}
              <Form onSubmit={handleSubmit}>
                <Form.Group id="username" className="mb-3">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    placeholder="Enter your username"
                    disabled={authLoading}
                    autoFocus
                  />
                </Form.Group>
                <Form.Group id="password"  className="mb-4">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Enter your password"
                    disabled={authLoading}
                  />
                </Form.Group>
                <Button disabled={authLoading} className="w-100 auth-button btn-primary" type="submit">
                  {authLoading ? (
                    <>
                      <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true"/>
                      <span className="ms-2">Logging In...</span>
                    </>
                  ) : ( 'Log In' )}
                </Button>
              </Form>
            </Card.Body>
          </Card>
          <div className="w-100 text-center mt-3 auth-switch-link">
            Need an account? <Link to="/register" className="fw-medium">Register here</Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
export default Login;