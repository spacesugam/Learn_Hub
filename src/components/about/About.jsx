import React from 'react';
import { Container, Row, Col, Card, Button, Accordion } from 'react-bootstrap';
function About() {
  return (
    <Container className="py-5">
      <Row className="mb-5">
        <Col lg={8} className="mx-auto text-center">
          <h1 className="display-4 mb-4">About LearnHub</h1>
          <p className="lead text-muted mb-4">
            We're on a mission to transform lives through education by enabling anyone anywhere to access life-changing learning experiences.
          </p>
          <hr className="my-5" />
        </Col>
      </Row>

      <Row className="mb-5">
        <Col md={6}>
          <h2 className="mb-4">Our Story</h2>
          <p>
            LearnHub was founded in 2015 with a clear vision: to create a world where anyone, anywhere can transform their life through learning. What began as a small collection of courses has grown into one of the largest online learning platforms, helping millions of students learn new skills and achieve their goals.
          </p>
          <p>
            Our platform now hosts over 150,000 courses taught by expert instructors across numerous subjects, from programming and business to photography and music. We're proud to have facilitated more than 500 million course enrollments worldwide.
          </p>
        </Col>
        <Col md={6}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Img variant="top" src="c1.jpg" alt="Team collaboration" />
            <Card.Body className="p-4">
              <Card.Title as="h3">By the Numbers</Card.Title>
              <div className="d-flex justify-content-between my-4">
                <div className="text-center">
                  <h2 className="fw-bold text-primary">50M+</h2>
                  <p className="text-muted">Students</p>
                </div>
                <div className="text-center">
                  <h2 className="fw-bold text-primary">150K+</h2>
                  <p className="text-muted">Courses</p>
                </div>
                <div className="text-center">
                  <h2 className="fw-bold text-primary">65K+</h2>
                  <p className="text-muted">Instructors</p>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mb-5">
        <Col lg={12}>
          <h2 className="mb-4">Our Mission & Values</h2>
          <Row>
            <Col md={4} className="mb-4">
              <Card className="h-100 border-0 shadow-sm">
                <Card.Body className="p-4">
                  <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center mb-3" style={{ width: '60px', height: '60px' }}>
                    <i className="bi bi-lightbulb fs-4"></i>
                  </div>
                  <Card.Title as="h4">Quality Education</Card.Title>
                  <Card.Text>
                    We believe in the power of education to transform lives. Our courses are designed to be comprehensive, up-to-date, and engaging.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-4">
              <Card className="h-100 border-0 shadow-sm">
                <Card.Body className="p-4">
                  <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center mb-3" style={{ width: '60px', height: '60px' }}>
                    <i className="bi bi-globe fs-4"></i>
                  </div>
                  <Card.Title as="h4">Global Access</Card.Title>
                  <Card.Text>
                    Education should know no boundaries. We're committed to making quality learning experiences accessible to everyone, everywhere.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-4">
              <Card className="h-100 border-0 shadow-sm">
                <Card.Body className="p-4">
                  <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center mb-3" style={{ width: '60px', height: '60px' }}>
                    <i className="bi bi-people fs-4"></i>
                  </div>
                  <Card.Title as="h4">Community First</Card.Title>
                  <Card.Text>
                    We foster a supportive community where students and instructors can connect, collaborate, and grow together.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>

      <Row className="mb-5">
        <Col lg={12}>
          <h2 className="mb-4">Frequently Asked Questions</h2>
          <Accordion>
            <Accordion.Item eventKey="0">
              <Accordion.Header>How does LearnHub work?</Accordion.Header>
              <Accordion.Body>
                LearnHub is an online learning platform where students can discover courses taught by expert instructors. Browse our course catalog, select a course that interests you, and start learning at your own pace. Our courses include video lectures, quizzes, assignments, and peer discussions to enhance your learning experience.
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="1">
              <Accordion.Header>How do I become an instructor?</Accordion.Header>
              <Accordion.Body>
                Anyone with knowledge to share can become a LearnHub instructor. Simply create an account, build your course using our course creation tools, and submit it for review. Once approved, your course will be available to millions of students worldwide, and you'll earn revenue from every student enrollment.
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="2">
              <Accordion.Header>Are certificates provided upon course completion?</Accordion.Header>
              <Accordion.Body>
                Yes, we provide certificates of completion for all our courses. These certificates can be shared on social media platforms like LinkedIn or added to your resume to showcase your new skills to potential employers.
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="3">
              <Accordion.Header>What is the refund policy?</Accordion.Header>
              <Accordion.Body>
                We offer a 30-day money-back guarantee for most courses. If you're unsatisfied with a course, you can request a refund within 30 days of purchase, provided you haven't completed more than 50% of the course content.
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </Col>
      </Row>

      <Row className="py-5 text-center">
        <Col lg={8} className="mx-auto">
          <h2>Join Our Team</h2>
          <p className="lead text-muted mb-4">
            We're always looking for talented individuals who are passionate about education and technology to join our growing team.
          </p>
          <Button variant="primary" size="lg">View Open Positions</Button>
        </Col>
      </Row>
    </Container>
  );
}

export default About;