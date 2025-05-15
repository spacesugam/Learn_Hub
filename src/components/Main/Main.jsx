// src/components/Main/Main.jsx
'use client'; // Add if using Next.js App Router and this component has state/effects

import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import * as api from '../../services/api'; // Your API service
import { Container, Row, Col, Card, Button, Spinner, Alert, Badge, Form } from 'react-bootstrap';
import './Main.css'; // Your Main.css for styling

// Reusable CourseCard component (can be moved to a separate file)
const CourseCardDisplay = ({ course, onEnroll, isEnrolled, enrollLoading, currentUser }) => {
    const navigate = useNavigate();

    const handleEnrollClick = () => {
        if (!currentUser) {
            navigate('/login', { state: { from: { pathname: `/` } } }); // Redirect to login, then back to home
            return;
        }
        if (currentUser.role !== 'user') {
            alert("Only students can enroll in courses."); // Or disable button
            return;
        }
        onEnroll(course.id);
    };

    const displayPrice = parseFloat(course.price);
    const formattedPrice = !isNaN(displayPrice) ? displayPrice.toFixed(2) : 'N/A';

    return (
        <Col>
            <Card className="h-100 course-display-card shadow-sm">
                <Link to={`/courses/${course.id}`} className="course-card-link"> {/* Optional: Link to course detail page */}
                    <Card.Img
                        variant="top"
                        src={course.image || '/images/course-placeholder.jpg'} // Provide a placeholder
                        alt={course.title}
                        className="course-card-img"
                    />
                </Link>
                <Card.Body className="d-flex flex-column">
                    <Badge bg="secondary" pill className="course-category-badge mb-2 align-self-start">
                        {course.category}
                    </Badge>
                    <Card.Title className="course-title mb-1">
                        <Link to={`/courses/${course.id}`} className="course-card-link">{course.title}</Link>
                    </Card.Title>
                    <Card.Subtitle className="mb-2 text-muted course-instructor small">
                        By {course.instructorName || 'LearnHub Faculty'}
                    </Card.Subtitle>
                    <Card.Text className="course-description small flex-grow-1">
                        {course.description ? `${course.description.substring(0, 80)}...` : 'No description available.'}
                    </Card.Text>
                    <div className="mt-auto"> {/* Pushes content below to the bottom */}
                        <div className="d-flex justify-content-between align-items-center mb-2">
                            <span className="course-price fw-bold">${formattedPrice}</span>
                            {/* Add rating or duration if available */}
                            {course.duration && <Badge bg="light" text="dark">{course.duration}</Badge>}
                        </div>
                        {isEnrolled ? (
                            <Button variant="outline-success" className="w-100" disabled>
                                <i className="fas fa-check-circle me-1"></i> Enrolled
                            </Button>
                        ) : (
                            <Button
                                variant="primary"
                                className="w-100 enroll-button"
                                onClick={handleEnrollClick}
                                disabled={enrollLoading === course.id || (currentUser && currentUser.role !== 'user')}
                            >
                                {enrollLoading === course.id ? (
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


function Main() {
    const { currentUser } = useAuth();
    const [courses, setCourses] = useState([]);
    const [categories, setCategories] = useState([]);
    const [filteredCourses, setFilteredCourses] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');

    const [myEnrolledCourseIds, setMyEnrolledCourseIds] = useState(new Set());
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [enrollLoading, setEnrollLoading] = useState(null); // Stores ID of course being enrolled

    const fetchHomePageData = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const [fetchedCourses, fetchedCategories] = await Promise.all([
                api.getPublishedCourses(),
                api.getCourseCategories() // Using the new API function
            ]);
            setCourses(fetchedCourses);
            setFilteredCourses(fetchedCourses); // Initially show all
            setCategories(['All', ...fetchedCategories]); // Add 'All' option

            if (currentUser && currentUser.role === 'user') {
                const enrolled = await api.getEnrolledCoursesForUser(currentUser.id);
                setMyEnrolledCourseIds(new Set(enrolled.map(c => c.id)));
            }

        } catch (err) {
            console.error("Error fetching homepage data:", err);
            setError("Could not load courses. Please try refreshing the page.");
        } finally {
            setLoading(false);
        }
    }, [currentUser]); // Re-fetch if currentUser changes (e.g., login/logout)

    useEffect(() => {
        fetchHomePageData();
    }, [fetchHomePageData]);

    useEffect(() => {
        let currentCourses = [...courses];
        if (selectedCategory !== 'All') {
            currentCourses = currentCourses.filter(course => course.category === selectedCategory);
        }
        if (searchTerm) {
            currentCourses = currentCourses.filter(course =>
                course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                course.instructorName?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        setFilteredCourses(currentCourses);
    }, [selectedCategory, searchTerm, courses]);


    const handleEnroll = async (courseId) => {
        if (!currentUser) { // Should be caught by button logic, but double-check
            // Handled by button logic to redirect
            return;
        }
        setEnrollLoading(courseId);
        try {
            const result = await api.enrollInCourse(currentUser.id, courseId);
            if (result.success) {
                setMyEnrolledCourseIds(prev => new Set(prev).add(courseId));
                // Optionally show a success message
                alert("Successfully enrolled!");
            } else {
                alert(result.message || "Enrollment failed. You might already be enrolled or an error occurred.");
            }
        } catch (err) {
            alert("An error occurred during enrollment.");
        } finally {
            setEnrollLoading(null);
        }
    };

    if (loading) {
        return (
            <Container className="text-center py-5">
                <Spinner animation="border" variant="primary" style={{ width: '3rem', height: '3rem' }} />
                <p className="mt-3 lead">Loading available courses...</p>
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="py-5">
                <Alert variant="danger" className="text-center">{error}</Alert>
            </Container>
        );
    }

    return (
        <Container fluid="lg" className="main-page-container py-4">
            <header className="main-hero text-center py-5 mb-5 bg-light rounded shadow-sm">
                <h1 className="display-4 fw-bold">Expand Your Skills with Online Courses</h1>
                <p className="lead col-md-8 mx-auto text-muted">
                    Learn from industry experts and advance your career with our wide range of professional courses.
                    Find the perfect course to achieve your goals.
                </p>
                {/* Optional: Add a prominent search bar here or a call to action button */}
            </header>

            <Row className="mb-4">
                <Col md={4}>
                    <Form.Group controlId="courseSearch">
                        <Form.Control
                            type="search"
                            placeholder="Search courses by title or instructor..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </Form.Group>
                </Col>
                <Col md={8}>
                    <div className="category-filter-pills d-flex flex-wrap justify-content-start justify-content-md-end">
                        {categories.map(category => (
                            <Button
                                key={category}
                                variant={selectedCategory === category ? 'primary' : 'outline-secondary'}
                                size="sm"
                                className="me-2 mb-2 category-pill-btn"
                                onClick={() => setSelectedCategory(category)}
                            >
                                {category}
                            </Button>
                        ))}
                    </div>
                </Col>
            </Row>


            {filteredCourses.length > 0 ? (
                <Row xs={1} sm={2} md={3} lg={4} className="g-4">
                    {filteredCourses.map(course => (
                        <CourseCardDisplay
                            key={course.id}
                            course={course}
                            onEnroll={handleEnroll}
                            isEnrolled={myEnrolledCourseIds.has(course.id)}
                            enrollLoading={enrollLoading}
                            currentUser={currentUser}
                        />
                    ))}
                </Row>
            ) : (
                <Alert variant="info" className="text-center py-4">
                    <i className="fas fa-search fa-2x mb-3 d-block"></i>
                    <h4>No courses found</h4>
                    <p>Try adjusting your search or category filters, or check back later for new additions!</p>
                </Alert>
            )}

            {/* You can add more sections like "Trending", "Newest" by fetching and filtering data differently */}
        </Container>
    );
}

export default Main;