// src/components/auth/ProtectedRoute.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Spinner, Container } from 'react-bootstrap';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { currentUser, loading } = useAuth();
  const location = useLocation();

  if (loading) { // Changed this: always show loading if AuthContext is loading
    return (
        <Container fluid className="d-flex justify-content-center align-items-center" style={{ minHeight: 'calc(100vh - 120px)', backgroundColor: '#fff' }}>
            <Spinner animation="border" variant="primary" style={{ width: '3rem', height: '3rem' }}>
                <span className="visually-hidden">Loading application state...</span>
            </Spinner>
        </Container>
    );
  }

  if (!currentUser) {
    console.log("ProtectedRoute: No currentUser, redirecting to login. From:", location.pathname);
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    console.log(`ProtectedRoute: Role [${currentUser.role}] not allowed for ${location.pathname}. Redirecting.`);
    // Redirect to their default dashboard or a generic "unauthorized" page
    // If they have a role, send them to their standard dashboard.
    let redirectPath = '/dashboard'; 
    if (currentUser.role === 'admin') redirectPath = '/admin';
    if (currentUser.role === 'faculty') redirectPath = '/faculty';
    
    return <Navigate to={redirectPath} state={{ unauthorizedAttempt: location.pathname }} replace />;
  }

  // User is authenticated and has an allowed role
  return children;
};

export default ProtectedRoute;