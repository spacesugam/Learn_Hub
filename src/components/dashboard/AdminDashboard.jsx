// src/components/dashboard/AdminDashboard.jsx
'use client'; // If using Next.js App Router

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import * as api from '../../services/api';
import { Row, Col, Card, Table, Button, Badge, Spinner, Alert, Modal, Form, Tab, Nav, ListGroup } from 'react-bootstrap';

// Import the new Analytics component
import AdminAnalytics from './AdminAnalytics'; // Adjust path if needed

// UserEditModal component (keep as is or move to separate file)
const UserEditModal = ({ show, handleClose, user, handleSubmit, loading }) => {
    // ... (UserEditModal code from your previous version) ...
    const [formData, setFormData] = useState({ username: '', email: '', role: 'user', status: 'active' });
    const { currentUser: adminUser } = useAuth();

    useEffect(() => {
        if (user) {
            setFormData({
                username: user.username || '', email: user.email || '',
                role: user.role || 'user', status: user.status || 'active'
            });
        }
    }, [user]);

    const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    const onFormSubmit = (e) => { e.preventDefault(); handleSubmit(user.id, formData); };
    const isCurrentUserEditingSelf = user && adminUser && user.id === adminUser.id;

    return (
        <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>
            <Modal.Header closeButton><Modal.Title>Edit User: {user?.username}</Modal.Title></Modal.Header>
            <Form onSubmit={onFormSubmit}>
                <Modal.Body>
                    <Form.Group className="mb-3"><Form.Label>Username</Form.Label><Form.Control type="text" name="username" value={formData.username} onChange={handleChange} required /></Form.Group>
                    <Form.Group className="mb-3"><Form.Label>Email</Form.Label><Form.Control type="email" name="email" value={formData.email} onChange={handleChange} required /></Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Role</Form.Label>
                        <Form.Select name="role" value={formData.role} onChange={handleChange} disabled={isCurrentUserEditingSelf}>
                            <option value="user">User/Student</option><option value="faculty">Faculty</option><option value="admin">Admin</option>
                        </Form.Select>
                        {isCurrentUserEditingSelf && <Form.Text muted>Admins cannot change their own role.</Form.Text>}
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Status</Form.Label>
                        <Form.Select name="status" value={formData.status} onChange={handleChange} disabled={isCurrentUserEditingSelf}>
                            <option value="active">Active</option><option value="inactive">Inactive</option>
                        </Form.Select>
                        {isCurrentUserEditingSelf && <Form.Text muted>Admins cannot deactivate themselves.</Form.Text>}
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose} disabled={loading}>Cancel</Button>
                    <Button variant="primary" type="submit" disabled={loading}>{loading ? <Spinner as="span" animation="border" size="sm" /> : 'Save Changes'}</Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};

function AdminDashboard() {
  const { currentUser, updateCurrentAuthUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [stats, setStats] = useState({}); // General stats for cards
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  // Combined fetchData for initial dashboard load (excluding detailed analytics)
  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      // Fetch only essential data for the main dashboard view initially
      // Analytics data will be fetched by AdminAnalytics component itself
      const [fetchedUsers, fetchedCourses, fetchedStats] = await Promise.all([
        api.getUsers(),
        api.getCourses(),
        api.getAdminDashboardStats()
      ]);
      setUsers(fetchedUsers);
      setCourses(fetchedCourses);
      setStats(fetchedStats.stats);
    } catch (err) {
      console.error("Error fetching admin dashboard data:", err);
      setError("Could not load admin dashboard main data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleOpenUserModal = (user) => { setEditingUser(user); setShowUserModal(true); };
  const handleCloseUserModal = () => { setShowUserModal(false); setEditingUser(null); };

  const handleUserUpdate = async (userId, userData) => {
    setActionLoading(true);
    const result = await api.updateUser(userId, userData);
    setActionLoading(false);
    if (result.success) {
      fetchDashboardData(); // Refresh main dashboard data
      handleCloseUserModal();
      if (currentUser.id === userId) {
          updateCurrentAuthUser(result.user);
      }
    } else {
      alert(result.message || "Failed to update user.");
    }
  };

  const handleDeleteUser = async (userId, username) => {
    if (userId === currentUser.id) { alert("You cannot delete your own admin account."); return; }
    if (!window.confirm(`Delete user "${username}"?`)) return;
    const result = await api.deleteUser(userId);
    if (result.success) { fetchDashboardData(); }
    else { alert("Failed to delete user."); }
  };

  if (loading && !showUserModal) {
    return <div className="text-center p-5"><Spinner animation="border" variant="primary" /> <p className="mt-2">Loading Admin Dashboard...</p></div>;
  }
  if (error) {
    return <Alert variant="danger" className="text-center">{error}</Alert>;
  }

  return (
    <div className="admin-dashboard-container"> {/* Added a container class */}
      <Row className="mb-4 align-items-center">
        <Col>
            <h1 className="dashboard-title h2"><i className="fas fa-user-shield me-2"></i>Administrator Panel</h1>
            <p className="lead text-muted">Oversee platform activity, {currentUser.username}.</p>
        </Col>
      </Row>

      {/* Stats Cards */}
      <Row className="g-4 mb-4">
        <Col md={6} lg={3}><Card className="dashboard-stat-card bg-primary text-white h-100"><Card.Body><Card.Title>Total Users</Card.Title><Card.Text className="display-6 fw-bold">{stats.totalUsers || 0}</Card.Text><i className="fas fa-users fa-3x"></i></Card.Body></Card></Col>
        <Col md={6} lg={3}><Card className="dashboard-stat-card bg-success text-white h-100"><Card.Body><Card.Title>Active Courses</Card.Title><Card.Text className="display-6 fw-bold">{stats.activeCourses || 0}</Card.Text><i className="fas fa-book-open fa-3x"></i></Card.Body></Card></Col>
        <Col md={6} lg={3}><Card className="dashboard-stat-card bg-info text-white h-100"><Card.Body><Card.Title>Faculty Members</Card.Title><Card.Text className="display-6 fw-bold">{stats.facultyCount || 0}</Card.Text><i className="fas fa-chalkboard-teacher fa-3x"></i></Card.Body></Card></Col>
        <Col md={6} lg={3}><Card className="dashboard-stat-card bg-secondary text-white h-100"><Card.Body><Card.Title>Students</Card.Title><Card.Text className="display-6 fw-bold">{stats.studentCount || 0}</Card.Text><i className="fas fa-user-graduate fa-3x"></i></Card.Body></Card></Col>
      </Row>

      <Tab.Container defaultActiveKey="management"> {/* Changed default key */}
        <Nav variant="pills" className="mb-3 nav-pills-custom admin-main-nav">
          <Nav.Item><Nav.Link eventKey="management"><i className="fas fa-tasks me-2"></i>Management</Nav.Link></Nav.Item>
          <Nav.Item><Nav.Link eventKey="analytics"><i className="fas fa-chart-line me-2"></i>Data Analytics</Nav.Link></Nav.Item>
          {/* Add other main tabs like Settings */}
        </Nav>

        <Tab.Content>
          <Tab.Pane eventKey="management">
            {/* This is where your existing User/Course/Enrollment management tabs go */}
            <Tab.Container defaultActiveKey="users">
                <Nav variant="tabs" className="mb-3 sub-nav-tabs">
                    <Nav.Item><Nav.Link eventKey="users"><i className="fas fa-users-cog me-1"></i>Users</Nav.Link></Nav.Item>
                    <Nav.Item><Nav.Link eventKey="courses"><i className="fas fa-book me-1"></i>Courses</Nav.Link></Nav.Item>
                    <Nav.Item><Nav.Link eventKey="enrollments"><i className="fas fa-clipboard-list me-1"></i>Enrollments</Nav.Link></Nav.Item>
                </Nav>
                <Tab.Content>
                    <Tab.Pane eventKey="users">
                        <Card className="dashboard-widget-card shadow-sm">
                          <Card.Header>All Platform Users</Card.Header>
                          {users.length > 0 ? (
                            <Table responsive hover className="admin-table mb-0">
                              <thead className="table-light">
                                <tr><th>Username</th><th>Email</th><th>Role</th><th>Status</th><th>Joined</th><th>Courses</th><th>Actions</th></tr>
                              </thead>
                              <tbody>
                                {users.map(user => (
                                  <tr key={user.id}>
                                    <td className="fw-medium">{user.username}</td><td>{user.email}</td>
                                    <td><Badge pill bg={user.role === 'admin' ? 'danger' : (user.role === 'faculty' ? 'info' : 'primary')} className="role-badge">{user.role}</Badge></td>
                                    <td><Badge pill className="status-badge" bg={user.status === 'active' ? 'success-light' : 'danger-light'} text={user.status === 'active' ? 'success' : 'danger'}>{user.status}</Badge></td>
                                    <td className="text-muted small">{user.joined ? new Date(user.joined).toLocaleDateString() : 'N/A'}</td>
                                    <td className="text-muted small">{user.enrolledCourses?.length || 0}</td>
                                    <td>
                                      <Button variant="outline-primary" size="sm" className="me-1 action-btn" onClick={() => handleOpenUserModal(user)} title="Edit User"><i className="fas fa-user-edit"></i></Button>
                                      <Button variant="outline-danger" size="sm" className="action-btn" onClick={() => handleDeleteUser(user.id, user.username)} title="Delete User" disabled={user.id === currentUser.id}><i className="fas fa-user-times"></i></Button>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </Table>
                          ) : <Card.Body className="text-center text-muted">No users found.</Card.Body>}
                        </Card>
                    </Tab.Pane>
                    <Tab.Pane eventKey="courses">
                        <Card className="dashboard-widget-card shadow-sm">
                            <Card.Header>All Platform Courses</Card.Header>
                            {courses.length > 0 ? (
                                <Table responsive hover className="admin-table mb-0">
                                    <thead className="table-light"><tr><th>Title</th><th>Category</th><th>Instructor</th><th>Price</th><th>Status</th><th>Actions</th></tr></thead>
                                    <tbody>
                                        {courses.map(course => (
                                            <tr key={course.id}>
                                                <td className="fw-medium">{course.title}</td><td>{course.category}</td><td>{course.instructorName}</td>
                                                <td>${parseFloat(course.price)?.toFixed(2) || '0.00'}</td>
                                                <td><Badge pill bg={course.status === 'Published' ? 'success' : (course.status === 'Draft' ? 'warning' : 'secondary')} text={course.status === 'Published' ? 'light' : (course.status === 'Draft' ? 'dark' : 'light')}>{course.status}</Badge></td>
                                                <td>
                                                    <Button variant="outline-info" size="sm" className="me-1 action-btn" title="Edit Course Details"><i className="fas fa-edit"></i></Button>
                                                    <Button variant="outline-danger" size="sm" className="action-btn" title="Delete Course"><i className="fas fa-trash"></i></Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            ) : <Card.Body className="text-center text-muted">No courses found.</Card.Body>}
                        </Card>
                    </Tab.Pane>
                    <Tab.Pane eventKey="enrollments">
                        <Card className="dashboard-widget-card shadow-sm">
                            <Card.Header>Enrollment Overview</Card.Header>
                            <Card.Body>
                                {users.filter(u => u.role === 'user' && u.enrolledCourses?.length > 0).length > 0 ? (
                                    <ListGroup variant="flush">
                                    {users.filter(u => u.role === 'user' && u.enrolledCourses?.length > 0).map(user => (
                                        <ListGroup.Item key={user.id}>
                                            <div className="fw-bold">{user.username} ({user.email}) - Enrolled in ({user.enrolledCourses.length}):</div>
                                            <ul className="list-unstyled ps-3 mt-1">
                                                {user.enrolledCourses.map(courseId => {
                                                    const course = courses.find(c => c.id === courseId);
                                                    return <li key={courseId} className="small text-muted"><i className="fas fa-book-open text-primary me-2"></i>{course ? course.title : `Course ID: ${courseId}`}</li>;
                                                })}
                                            </ul>
                                        </ListGroup.Item>
                                    ))}
                                    </ListGroup>
                                ) : <p className="text-muted text-center py-3">No active student enrollments to display.</p>}
                            </Card.Body>
                        </Card>
                    </Tab.Pane>
                </Tab.Content>
            </Tab.Container>
          </Tab.Pane>

          <Tab.Pane eventKey="analytics">
            <AdminAnalytics /> {/* Render the new analytics component here */}
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>

      <UserEditModal
        show={showUserModal}
        handleClose={handleCloseUserModal}
        user={editingUser}
        handleSubmit={handleUserUpdate}
        loading={actionLoading}
      />
    </div>
  );
}
export default AdminDashboard;