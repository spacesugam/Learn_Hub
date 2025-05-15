// src/components/dashboard/UserDashboard.jsx
'use client'; // If using Next.js App Router

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import * as api from '../../services/api';
import { Container, Row, Col, Card, Button, Spinner, Alert, Badge } from 'react-bootstrap';
// import { Link } from 'react-router-dom'; // Not used currently, can remove or add if needed

function UserDashboard() {
  const { currentUser } = useAuth();
  const [allCourses, setAllCourses] = useState([]);
  const [myCourses, setMyCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(null);

  const fetchData = useCallback(async () => {
    if (!currentUser?.id) return; // Guard against missing currentUser
    setLoading(true);
    setError('');
    try {
      const [fetchedAllCourses, fetchedMyCourses] = await Promise.all([
        api.getPublishedCourses(),
        api.getEnrolledCoursesForUser(currentUser.id)
      ]);
      setAllCourses(fetchedAllCourses);
      setMyCourses(fetchedMyCourses);
    } catch (err) {
      console.error("Error fetching user dashboard data:", err);
      setError("Could not load your dashboard. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [currentUser?.id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleEnroll = async (courseId) => {
    if (!currentUser) return;
    setActionLoading(courseId);
    const result = await api.enrollInCourse(currentUser.id, courseId);
    if (result.success) {
      fetchData();
      alert("Successfully enrolled!"); // Replace with better notification
    } else {
      alert(result.message || "Failed to enroll.");
    }
    setActionLoading(null);
  };

  const handleUnenroll = async (courseId) => {
    if (!currentUser || !window.confirm("Are you sure you want to unenroll from this course?")) return;
    setActionLoading(courseId);
    const result = await api.unenrollFromCourse(currentUser.id, courseId);
    if (result.success) {
      fetchData();
      alert("Successfully unenrolled."); // Replace with better notification
    } else {
      alert(result.message || "Failed to unenroll.");
    }
    setActionLoading(null);
  };

  const isEnrolled = (courseId) => myCourses.some(mc => mc.id === courseId);

  const renderCourseCard = (course, type) => {
    const priceAsNumber = parseFloat(course.price);
    const displayPrice = !isNaN(priceAsNumber) ? priceAsNumber.toFixed(2) : 'N/A';

    return (
      <Col key={course.id} className="mb-4"> {/* Ensure Col takes care of spacing */}
        <Card className="h-100 user-dashboard-course-card shadow-sm"> {/* `h-100` is key */}
          {course.image && (
            <Card.Img
              variant="top"
              src={course.image || '/images/course-placeholder.jpg'}
              alt={course.title}
              className="user-dashboard-card-img"
            />
          )}
          <Card.Body className="d-flex flex-column"> {/* Flex column for body content */}
            <div> {/* Wrapper for top content to allow button to be pushed down */}
              <Card.Title className="course-card-title mb-1">{course.title}</Card.Title>
              <Card.Subtitle className="mb-2 text-muted small">
                By {course.instructorName || 'LearnHub Faculty'}
                <Badge bg={type === 'enrolled' ? "info" : "secondary"} pill className="ms-2">{course.category}</Badge>
              </Card.Subtitle>
              <Card.Text className="course-card-description small">
                {/* Fixed height or line clamping for description is also an option via CSS */}
                {course.description ? `${course.description.substring(0, 100)}...` : 'No description available.'}
              </Card.Text>
              {type === 'available' && (
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="course-price fw-bold">${displayPrice}</span>
                  {course.duration && <Badge bg="light" text="dark">{course.duration}</Badge>}
                </div>
              )}
            </div>
            <div className="mt-auto"> {/* This pushes the button to the bottom */}
              {type === 'enrolled' ? (
                <Button
                  variant="outline-danger"
                  size="sm"
                  className="w-100"
                  onClick={() => handleUnenroll(course.id)}
                  disabled={actionLoading === course.id}
                >
                  {actionLoading === course.id ? (
                    <Spinner as="span" animation="border" size="sm" />
                  ) : (
                    <><i className="fas fa-times-circle me-1"></i> Unenroll</>
                  )}
                </Button>
              ) : (
                <Button
                  variant="success"
                  className="w-100"
                  onClick={() => handleEnroll(course.id)}
                  disabled={actionLoading === course.id}
                >
                  {actionLoading === course.id ? (
                    <Spinner as="span" animation="border" size="sm" />
                  ) : (
                    <><i className="fas fa-plus-circle me-1"></i> Enroll Now</>
                  )}
                </Button>
              )}
            </div>
          </Card.Body>
        </Card>
      </Col>
    );
  };


  if (loading && !currentUser?.id) {
      return <div className="text-center p-5"><Spinner animation="border" variant="primary" /> <p className="mt-2">Authenticating...</p></div>;
  }
  if (loading) {
    return <div className="text-center p-5"><Spinner animation="border" variant="primary" /> <p className="mt-2">Loading your dashboard...</p></div>;
  }
  if (error) {
    return <Alert variant="danger" className="text-center">{error}</Alert>;
  }
  if (!currentUser) {
    return <Alert variant="warning" className="text-center">Not authenticated. Please log in.</Alert>;
  }


  return (
    <Container fluid="lg" className="user-dashboard-container py-4">
      <Row className="mb-4 align-items-center">
        <Col>
            <h1 className="dashboard-title h2"><i className="fas fa-user-graduate me-2"></i>My Learning Dashboard</h1>
            <p className="lead text-muted">Welcome, {currentUser.username}! Browse courses and manage your learning journey.</p>
        </Col>
      </Row>

      <section className="mb-5">
        <h3 className="mb-3 section-title"><i className="fas fa-book-reader me-2 text-success"></i>My Enrolled Courses</h3>
        {myCourses.length > 0 ? (
          <Row xs={1} md={2} lg={3} className="g-4"> {/* `g-4` provides gutters */}
            {myCourses.map(course => renderCourseCard(course, 'enrolled'))}
          </Row>
        ) : (
          <Alert variant="info" className="text-center py-3">
             <i className="fas fa-info-circle me-2"></i>You are not currently enrolled in any courses. Explore available courses below!
          </Alert>
        )}
      </section>

      <section>
        <h3 className="mb-3 section-title"><i className="fas fa-search me-2 text-primary"></i>Available Courses</h3>
        {allCourses.filter(ac => !isEnrolled(ac.id)).length > 0 ? (
          <Row xs={1} md={2} lg={3} xl={4} className="g-4">
            {allCourses.filter(ac => !isEnrolled(ac.id)).map(course => renderCourseCard(course, 'available'))}
          </Row>
        ) : (
          <Alert variant="light" className="text-center py-3">
            <i className="fas fa-folder-open me-2"></i>No new courses available for enrollment at the moment, or you're enrolled in all of them!
          </Alert>
        )}
      </section>
    </Container>
  );
}

export default UserDashboard;