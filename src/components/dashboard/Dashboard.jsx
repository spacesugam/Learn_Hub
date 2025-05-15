// src/components/dashboard/Dashboard.jsx
import React, { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Container, Row, Col, Alert } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';

// Import the specific dashboard components
import AdminDashboard from './AdminDashboard';
import FacultyDashboard from './FacultyDashboard';
import UserDashboard from './UserDashboard';
// You might want a shared CSS for dashboards or component-specific ones
// import './Dashboard.css'; // Now in App.js or index.js for global styles

function Dashboard() {
  const { currentUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // This effect ensures that the user is on the correct dashboard URL for their role.
  // e.g. if an admin lands on /dashboard, redirect them to /admin
  useEffect(() => {
    if (currentUser) {
      const pathForRole = {
        admin: '/admin',
        faculty: '/faculty',
        user: '/dashboard',
      };
      const expectedPath = pathForRole[currentUser.role];
      if (expectedPath && location.pathname !== expectedPath) {
        // Check if we are already on a role-specific path that's not for this user.
        // This is mostly handled by ProtectedRoute, but this is an extra check.
        // Only redirect if the current path is a generic /dashboard and user has specific role path
        if (location.pathname === '/dashboard' && (currentUser.role === 'admin' || currentUser.role === 'faculty')) {
            console.log(`Dashboard component: Redirecting ${currentUser.role} from /dashboard to ${expectedPath}`);
            navigate(expectedPath, { replace: true });
        }
      }
    }
  }, [currentUser, location.pathname, navigate]);

  const renderDashboardContent = () => {
    if (!currentUser) {
      return <Alert variant="danger">Error: Not logged in. This should not happen with ProtectedRoute.</Alert>;
    }

    // Determine which dashboard to render based on the current path and role
    // This logic is slightly different now because App.js routes directly to /admin, /faculty etc.
    // The `Dashboard` component itself will be rendered by those specific routes.
    // So, we mainly rely on `currentUser.role` passed down or implicitly.
    
    // If on /admin path, render AdminDashboard
    if (location.pathname.startsWith('/admin') && currentUser.role === 'admin') {
        return <AdminDashboard user={currentUser} />;
    }
    // If on /faculty path, render FacultyDashboard
    if (location.pathname.startsWith('/faculty') && (currentUser.role === 'faculty' || currentUser.role === 'admin')) {
        return <FacultyDashboard user={currentUser} />;
    }
    // If on /dashboard path (and not admin/faculty who should have been redirected), render UserDashboard
    if (location.pathname.startsWith('/dashboard') && currentUser.role === 'user') {
         return <UserDashboard user={currentUser} />;
    }
    
    // Fallback if logic above doesn't catch a specific case (e.g. admin on /faculty if allowed)
    // This relies on ProtectedRoute to ensure role is valid for the path.
    switch (currentUser.role) {
      case 'admin':
        return <AdminDashboard user={currentUser} />;
      case 'faculty':
        return <FacultyDashboard user={currentUser} />;
      case 'user':
      default:
        return <UserDashboard user={currentUser} />;
    }
  };

  return (
    <div className="dashboard-page-container py-4"> {/* Added padding */}
      <Container fluid="lg">
         {location.state?.unauthorizedAttempt && (
            <Alert variant="warning" className="mt-0 mb-4 shadow-sm">
                <i className="fas fa-exclamation-triangle me-2"></i>
                You tried to access <strong>{location.state.unauthorizedAttempt}</strong>, which you don't have permission for.
                You've been redirected to your dashboard.
            </Alert>
         )}
         {/* The H1 title could be part of the specific dashboards for more customization */}
         {/*
         <Row className="mb-4 align-items-center dashboard-header">
            <Col>
                <h1 className="dashboard-title">
                    <i className="fas fa-th-large me-2"></i>
                    {currentUser?.role.charAt(0).toUpperCase() + currentUser?.role.slice(1)} Dashboard
                </h1>
                <p className="lead text-muted">Welcome back, <span className="fw-bold">{currentUser?.username}</span>!</p>
            </Col>
        </Row>
        */}

        {renderDashboardContent()}
      </Container>
    </div>
  );
}

export default Dashboard;