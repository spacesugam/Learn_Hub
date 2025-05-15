// src/components/dashboard/FacultyDashboard.jsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import * as api from '../../services/api';
import { Row, Col, Card, Button, Spinner, Alert, ListGroup, Table, Modal, Form, Badge } from 'react-bootstrap';

// Course Form Component
const CourseForm = ({ show, handleClose, handleSubmit, course: initialCourse, loading }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'Web Development',
        price: 0, // Initialize price as a number
        duration: '',
        status: 'Draft',
        image: ''
    });

    useEffect(() => {
        if (initialCourse) {
            setFormData({
                title: initialCourse.title || '',
                description: initialCourse.description || '',
                category: initialCourse.category || 'Web Development',
                // Ensure price from initialCourse is parsed to number, default to 0 if invalid
                price: initialCourse.price !== undefined && initialCourse.price !== null ? (parseFloat(initialCourse.price) || 0) : 0,
                duration: initialCourse.duration || '',
                status: initialCourse.status || 'Draft',
                image: initialCourse.image || ''
            });
        } else {
            // Reset for new course
            setFormData({
                title: '', description: '', category: 'Web Development',
                price: 0, duration: '', status: 'Draft', image: ''
            });
        }
    }, [initialCourse, show]); // Re-populate/reset form when initialCourse or show changes

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'price') {
            // Allow empty string for user to clear input, otherwise parse to float
            // If parsing fails (e.g., non-numeric input), it might become NaN, which onFormSubmit will handle
            setFormData(prev => ({ ...prev, [name]: value === '' ? '' : parseFloat(value) }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const onFormSubmit = (e) => {
        e.preventDefault();
        // Ensure price is a number before submitting; default to 0 if empty or NaN
        const priceAsNumber = parseFloat(formData.price);
        const finalPrice = isNaN(priceAsNumber) ? 0 : priceAsNumber;

        const submissionData = {
            ...formData,
            price: finalPrice
        };
        handleSubmit(submissionData);
    };

    return (
        <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>{initialCourse ? 'Edit Course' : 'Create New Course'}</Modal.Title>
            </Modal.Header>
            <Form onSubmit={onFormSubmit}>
                <Modal.Body>
                    <Form.Group className="mb-3">
                        <Form.Label>Title</Form.Label>
                        <Form.Control type="text" name="title" value={formData.title} onChange={handleChange} required />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Description</Form.Label>
                        <Form.Control as="textarea" rows={3} name="description" value={formData.description} onChange={handleChange} required />
                    </Form.Group>
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Category</Form.Label>
                                <Form.Select name="category" value={formData.category} onChange={handleChange}>
                                    <option value="Web Development">Web Development</option>
                                    <option value="Data Science">Data Science</option>
                                    <option value="Marketing">Marketing</option>
                                    <option value="Design">Design</option>
                                    <option value="Business">Business</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                             <Form.Group className="mb-3">
                                <Form.Label>Price ($)</Form.Label>
                                <Form.Control
                                    type="number" // HTML5 type="number" for better UX
                                    name="price"
                                    value={formData.price} // formData.price could be number or ''
                                    onChange={handleChange}
                                    min="0"
                                    step="any" // Allow decimals
                                    placeholder="e.g., 49.99 or 0 for free"
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                     <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Duration</Form.Label>
                                <Form.Control type="text" name="duration" placeholder="e.g., 6 weeks" value={formData.duration} onChange={handleChange} />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Status</Form.Label>
                                <Form.Select name="status" value={formData.status} onChange={handleChange}>
                                    <option value="Draft">Draft</option>
                                    <option value="Published">Published</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Form.Group className="mb-3">
                        <Form.Label>Image URL (optional)</Form.Label>
                        <Form.Control type="text" name="image" placeholder="https://example.com/image.jpg" value={formData.image} onChange={handleChange} />
                        {formData.image && <img src={formData.image} alt="Preview" style={{maxWidth: '100px', maxHeight:'80px', objectFit: 'cover', marginTop: '10px'}}/>}
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose} disabled={loading}>Cancel</Button>
                    <Button variant="primary" type="submit" disabled={loading}>
                        {loading ? <Spinner as="span" animation="border" size="sm" /> : (initialCourse ? 'Save Changes' : 'Create Course')}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};


function FacultyDashboard() {
  const { currentUser } = useAuth();
  const [myCourses, setMyCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(false); // For modal submit

  const [showModal, setShowModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);

  const [showEnrolledModal, setShowEnrolledModal] = useState(false);
  const [enrolledStudents, setEnrolledStudents] = useState([]);
  const [selectedCourseForEnrollees, setSelectedCourseForEnrollees] = useState(null);
  const [enrolledModalLoading, setEnrolledModalLoading] = useState(false);

  const fetchMyCourses = useCallback(async () => {
    if (!currentUser?.id) return; // Guard clause
    setLoading(true);
    setError('');
    try {
      const courses = await api.getCoursesByFaculty(currentUser.id);
      setMyCourses(courses);
    } catch (err) {
      console.error("Error fetching faculty courses:", err);
      setError("Could not load your courses.");
    } finally {
      setLoading(false);
    }
  }, [currentUser?.id]);

  useEffect(() => {
    fetchMyCourses();
  }, [fetchMyCourses]); // fetchMyCourses has currentUser.id in its deps

  const handleOpenModal = (course = null) => {
    setEditingCourse(course);
    setShowModal(true);
  };
  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCourse(null);
  };

  const handleCourseSubmit = async (courseData) => {
    if (!currentUser) {
        alert("User not authenticated.");
        return;
    }
    setActionLoading(true);
    let result;
    try {
        if (editingCourse) {
            result = await api.updateCourse(editingCourse.id, courseData);
        } else {
            result = await api.createCourse(courseData, currentUser);
        }
        if (result.success) {
            fetchMyCourses(); // Re-fetch courses
            handleCloseModal();
        } else {
            alert(result.message || "Failed to save course.");
        }
    } catch (err) {
        alert("An error occurred while saving the course.");
        console.error("Course submit error:", err);
    } finally {
        setActionLoading(false);
    }
  };

  const handleDeleteCourse = async (courseId) => {
    if (!currentUser || !window.confirm("Are you sure you want to delete this course?")) return;
    try {
        const result = await api.deleteCourse(courseId);
        if (result.success) {
            fetchMyCourses(); // Re-fetch
        } else {
            alert("Failed to delete course.");
        }
    } catch (err) {
        alert("An error occurred while deleting the course.");
        console.error("Delete course error:", err);
    }
  };

  const handleViewEnrolled = async (course) => {
      setSelectedCourseForEnrollees(course);
      setEnrolledModalLoading(true);
      setShowEnrolledModal(true);
      try {
          const students = await api.getStudentsInCourse(course.id);
          setEnrolledStudents(students);
      } catch (e) {
          alert("Could not fetch enrolled students.");
          setError("Could not fetch enrolled students.");
      } finally {
          setEnrolledModalLoading(false);
      }
  };

  if (loading && !currentUser?.id) {
      return <div className="text-center p-5"><Spinner animation="border" variant="primary" /> <p className="mt-2">Authenticating...</p></div>;
  }
  if (loading) {
    return <div className="text-center p-5"><Spinner animation="border" variant="primary" /> <p className="mt-2">Loading your courses...</p></div>;
  }
  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }
  if (!currentUser) {
    return <Alert variant="warning">Not authenticated. Please log in.</Alert>;
  }

  return (
    <div>
        <Row className="mb-4 align-items-center">
            <Col>
                <h1 className="dashboard-title h2"><i className="fas fa-chalkboard-teacher me-2"></i>Faculty Dashboard</h1>
                <p className="lead text-muted">Manage your courses, {currentUser.username}.</p>
            </Col>
             <Col xs="auto">
                <Button variant="primary" onClick={() => handleOpenModal()}>
                    <i className="fas fa-plus-circle me-2"></i>Create New Course
                </Button>
            </Col>
        </Row>

      <Card className="dashboard-widget-card shadow-sm">
        <Card.Header>My Courses</Card.Header>
        {myCourses.length > 0 ? (
            <Table responsive hover className="faculty-table mb-0">
                <thead className="table-light">
                    <tr>
                        <th>Title</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Status</th>
                        <th>Enrollments</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {myCourses.map(course => {
                        const priceAsNumber = parseFloat(course.price);
                        const displayPrice = !isNaN(priceAsNumber) ? priceAsNumber.toFixed(2) : '0.00'; // Default to '0.00' if NaN

                        return (
                            <tr key={course.id}>
                                <td className="fw-medium">{course.title}</td>
                                <td>{course.category}</td>
                                <td>${displayPrice}</td>
                                <td>
                                    <Badge pill bg={course.status === 'Published' ? 'success' : 'warning'} text={course.status === 'Published' ? 'light' : 'dark'}>
                                        {course.status}
                                    </Badge>
                                </td>
                                <td>
                                    <Button variant="link" size="sm" onClick={() => handleViewEnrolled(course)}>
                                        View Students
                                    </Button>
                                </td>
                                <td>
                                    <Button variant="outline-primary" size="sm" className="me-1 action-btn" onClick={() => handleOpenModal(course)} title="Edit">
                                        <i className="fas fa-edit"></i>
                                    </Button>
                                    <Button variant="outline-danger" size="sm" className="action-btn" onClick={() => handleDeleteCourse(course.id)} title="Delete">
                                        <i className="fas fa-trash"></i>
                                    </Button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </Table>
        ) : (
            <Card.Body className="text-center text-muted">
                <p className="mb-2"><i className="fas fa-folder-open fa-2x mb-2"></i></p>
                You haven't created any courses yet.
            </Card.Body>
        )}
      </Card>

      <CourseForm
        show={showModal}
        handleClose={handleCloseModal}
        handleSubmit={handleCourseSubmit}
        course={editingCourse} // Pass `editingCourse` as `course` prop to CourseForm
        loading={actionLoading}
      />

        <Modal show={showEnrolledModal} onHide={() => setShowEnrolledModal(false)} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Students Enrolled in "{selectedCourseForEnrollees?.title}"</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {enrolledModalLoading ? <div className="text-center"><Spinner animation="border" /> <p>Loading students...</p></div> :
                    enrolledStudents.length > 0 ? (
                        <ListGroup variant="flush">
                            {enrolledStudents.map(student => (
                                <ListGroup.Item key={student.id} className="d-flex justify-content-between align-items-center">
                                    <span>{student.username} ({student.email})</span>
                                    <Badge bg="secondary" pill>{new Date(student.joined).toLocaleDateString()}</Badge>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    ) : <p className="text-muted">No students are currently enrolled in this course.</p>
                }
            </Modal.Body>
             <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowEnrolledModal(false)}>Close</Button>
            </Modal.Footer>
        </Modal>
    </div>
  );
}
export default FacultyDashboard;