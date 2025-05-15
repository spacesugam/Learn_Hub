// src/components/auth/Register.jsx
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Form, Button, Card, Alert, Spinner, Row, Col } from 'react-bootstrap';
import './Auth.css';

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('user');
  const [error, setError] = useState('');
  const { register, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!username || !email || !password || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
        setError('Please enter a valid email address.');
        return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    try {
      const result = await register(username, password, email, role); // Pass email
      if (result.success) {
        // Navigate based on role after successful registration
        switch (result.user.role) {
            case 'admin': // Should not happen via public form, but good to have
                navigate('/admin', { replace: true });
                break;
            case 'faculty':
                navigate('/faculty', { replace: true });
                break;
            default: // user
                navigate('/dashboard', { replace: true });
        }
      } else {
        setError(result.message || 'Registration failed. Please try again.');
      }
    } catch (err) {
      console.error("Registration error:", err);
      setError('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <div className="auth-page">
      <Container className="d-flex align-items-center justify-content-center">
        <div className="w-100" style={{ maxWidth: '550px' }}>
          <Card className="auth-card shadow">
            <Card.Body className="p-4 p-md-5">
              <h2 className="text-center mb-4 fw-bold">
                <i className="fas fa-user-plus me-2 text-primary"></i>Create Account
              </h2>
              {error && <Alert variant="danger" className="text-center small">{error}</Alert>}
              <Form onSubmit={handleSubmit}>
                 <Form.Group id="username" className="mb-3">
                  <Form.Label>Username</Form.Label>
                  <Form.Control type="text" value={username} onChange={(e) => setUsername(e.target.value)} required placeholder="Choose a username" disabled={authLoading} autoFocus/>
                </Form.Group>
                <Form.Group id="email" className="mb-3">
                  <Form.Label>Email Address</Form.Label>
                  <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="Enter your email" disabled={authLoading} />
                </Form.Group>
                <Row>
                  <Col md={6}>
                    <Form.Group id="password"  className="mb-3">
                      <Form.Label>Password</Form.Label>
                      <Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Min. 6 characters" disabled={authLoading}/>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group id="confirmPassword"  className="mb-3">
                      <Form.Label>Confirm Password</Form.Label>
                      <Form.Control type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required placeholder="Confirm password" disabled={authLoading}/>
                    </Form.Group>
                  </Col>
                </Row>
                 <Form.Group id="role" className="mb-4">
                    <Form.Label>Register as:</Form.Label>
                    <Form.Select value={role} onChange={(e) => setRole(e.target.value)} disabled={authLoading}>
                        <option value="user">Student / Learner</option>
                        <option value="faculty">Faculty / Instructor</option>
                    </Form.Select>
                </Form.Group>
                <Button disabled={authLoading} className="w-100 auth-button btn-primary" type="submit">
                 {authLoading ? (
                    <><Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true"/> <span className="ms-2">Registering...</span></>
                  ) : ( 'Register' )}
                </Button>
              </Form>
            </Card.Body>
          </Card>
          <div className="w-100 text-center mt-3 auth-switch-link">
            Already have an account? <Link to="/login" className="fw-medium">Log In here</Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
export default Register;