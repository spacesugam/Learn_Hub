import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Alert,
  NavLink,
} from "react-bootstrap";
import "./Contact.css";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  // Your business location coordinates
  const mapLocation = {
    address: "123 Learn Street, Education City, 10001",
    // You would replace these coordinates with your actual location
    lat: 40.7128,
    lng: -74.006,
  };
  
   const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null,
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Subject validation
    if (!formData.subject.trim()) {
      newErrors.subject = "Subject is required";
    }

    // Message validation
    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      // Form is valid - in a real app, you would send the data to a server here
      console.log("Form submitted:", formData);
      setSubmitted(true);

      // Reset form after submission
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });

      // Clear success message after 5 seconds
      setTimeout(() => {
        setSubmitted(false);
      }, 5000);
    }
  };

  return (
    <div className="contact-page">
      <Container className="py-5">
        <h1 className="text-center mb-5">
          <i className="fas fa-envelope-open-text me-2"></i>
          Contact Us
        </h1>

        {submitted && (
          <Alert
            variant="success"
            className="text-center mb-4"
            dismissible
            onClose={() => setSubmitted(false)
              
            }
           
          >
            <i className="fas fa-check-circle me-2"></i>
            Thank you for your message! We'll get back to you soon.
          </Alert>

          
          
        )}

        <Row className="justify-content-center">
          <Col lg={8} xl={7}>
            <Card className="contact-card shadow-lg">
              <Card.Body className="p-md-5">
                <Row>
                  <Col md={5} className="contact-info mb-4 mb-md-0">
                    <h3>Get In Touch</h3>
                    <p className="text-muted">
                      We'd love to hear from you. Fill out the form and we'll
                      get back to you as soon as possible.
                    </p>

                    <div className="contact-method">
                      <div className="method-header">
                        <i className="fas fa-map-marker-alt"></i>
                        <h5>Our Location</h5>
                      </div>
                      <p>{mapLocation.address}</p>
                    </div>

                    <div className="contact-method">
                      <div className="method-header">
                        <i className="fas fa-phone-alt"></i>
                        <h5>Phone Number</h5>
                      </div>
                      <p>(123) 456-7890</p>
                    </div>

                    <div className="contact-method">
                      <div className="method-header">
                        <i className="fas fa-envelope"></i>
                        <h5>Email Address</h5>
                      </div>
                      <p>info@learnhub.com</p>
                    </div>

                    <div className="social-links mt-4">
                      <a href="#" className="social-icon">
                        <i className="fab fa-facebook-f"></i>
                      </a>
                      <a href="#" className="social-icon">
                        <i className="fab fa-twitter"></i>
                      </a>
                      <a href="#" className="social-icon">
                        <i className="fab fa-instagram"></i>
                      </a>
                      <a href="#" className="social-icon">
                        <i className="fab fa-linkedin-in"></i>
                      </a>
                    </div>
                  </Col>

                  <Col md={7}>
                    <Form onSubmit={handleSubmit}>
                      <Form.Group className="mb-3">
                        <Form.Label>Your Name</Form.Label>
                        <Form.Control
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          isInvalid={!!errors.name}
                          placeholder="Enter your name"
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.name}
                        </Form.Control.Feedback>
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Email Address</Form.Label>
                        <Form.Control
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          isInvalid={!!errors.email}
                          placeholder="Enter your email"
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.email}
                        </Form.Control.Feedback>
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Subject</Form.Label>
                        <Form.Control
                          type="text"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          isInvalid={!!errors.subject}
                          placeholder="Enter subject"
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.subject}
                        </Form.Control.Feedback>
                      </Form.Group>

                      <Form.Group className="mb-4">
                        <Form.Label>Your Message</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={5}
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          isInvalid={!!errors.message}
                          placeholder="Type your message here..."
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.message}
                        </Form.Control.Feedback>
                      </Form.Group>

                      <Button type="submit" className="submit-btn" size="lg">
                        <i className="fas fa-paper-plane me-2"></i>
                        Send Message
                      </Button>
                    </Form>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row className="mt-5 pt-3">
          <Col>
            <Card className="map-card shadow-sm">
              <Card.Body className="p-0">
                <div className="google-map">
                  <iframe
                    title="Our Location"
                    width="100%"
                    height="450"
                    style={{ border: 0 }}
                    loading="lazy"
                    allowFullScreen
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.2163144780002!2d-74.0060!3d40.7128!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDDCsDQyJzQ2LjAiTiA3NMKwMDAnMjEuNiJX!5e0!3m2!1sen!2sin"
                  ></iframe>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Contact;
