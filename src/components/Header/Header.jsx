// src/components/Header/Header.jsx
import React from 'react';
import './Header.css'; // Make sure this CSS exists and is styled
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { NavDropdown, Image } from 'react-bootstrap'; // Using Image for potential avatar

function Header() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const getDashboardLink = () => {
    if (!currentUser) return "/"; 
    switch (currentUser.role) {
      case 'admin': return '/admin';
      case 'faculty': return '/faculty';
      case 'user':
      default: return '/dashboard'; 
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login'); // Ensure redirection after logout
  };

  return (
    <header className="app-header shadow-sm">
      <div className="header-content">
        <Link to="/" className="logo-section-link">
          <div className="logo-section">
            <i className="fas fa-graduation-cap logo-icon"></i>
            <h1>LearnHub</h1>
          </div>
        </Link>
        <nav className="main-nav">
          <ul>
            <li><NavLink to="/" className={({ isActive }) => isActive ? "active-link" : ""}>Home</NavLink></li>
            <li><NavLink to="/about" className={({ isActive }) => isActive ? "active-link" : ""}>About</NavLink></li>
            {/* Consider making Courses link public */}
            {/* <li><NavLink to="/courses" className={({ isActive }) => isActive ? "active-link" : ""}>Courses</NavLink></li> */}
            <li><NavLink to="/contact" className={({ isActive }) => isActive ? "active-link" : ""}>Contact</NavLink></li>
            
            {currentUser && (
              <li><NavLink to="/feedback" className={({ isActive }) => isActive ? "active-link" : ""}>Feedback</NavLink></li>
            )}
          </ul>
        </nav>
        <div className="auth-section">
          {currentUser ? (
            <NavDropdown
              title={
                <>
                  {/* Placeholder for avatar, could use currentUser.avatarUrl */}
                  {/* <Image src={currentUser.avatarUrl || '/path/to/default-avatar.png'} roundedCircle style={{ width: '30px', height: '30px', marginRight: '8px' }} /> */}
                  <i className="fas fa-user-circle me-2" style={{fontSize: '1.2rem'}}></i>
                  {currentUser.username}
                </>
              }
              id="user-nav-dropdown"
              align="end"
              className="user-dropdown"
            >
              <NavDropdown.Item as={Link} to={getDashboardLink()}>
                <i className="fas fa-tachometer-alt me-2"></i>Dashboard ({currentUser.role})
              </NavDropdown.Item>
              {/* <NavDropdown.Item as={Link} to="/profile-settings">
                <i className="fas fa-cog me-2"></i>Profile & Settings
              </NavDropdown.Item> */}
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={handleLogout}>
                <i className="fas fa-sign-out-alt me-2"></i>Logout
              </NavDropdown.Item>
            </NavDropdown>
          ) : (
            <ul className="auth-links">
              <li><NavLink to="/login" className="auth-link-btn login">Login</NavLink></li>
              <li><NavLink to="/register" className="auth-link-btn register">Register</NavLink></li>
            </ul>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;