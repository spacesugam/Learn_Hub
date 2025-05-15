import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Modal, Alert } from 'react-bootstrap';
import FeedbackList from './FeedbackList';
import FeedbackForm from './FeedbackForm';
import './Feedback.css'; // Import the CSS

function Feedback() {
  // --- State ---
  const [feedbackItems, setFeedbackItems] = useState(() => {
     // Lazy initial state: Load from localStorage or use sample data
    const savedFeedback = localStorage.getItem('learnhubFeedback');
    if (savedFeedback) {
      return JSON.parse(savedFeedback);
    } else {
      // Initial sample data if nothing in localStorage
      return [
        { id: 1, author: 'Alice', rating: 5, message: 'Great platform, very intuitive!', timestamp: new Date(Date.now() - 86400000).toISOString() }, // 1 day ago
        { id: 2, author: 'Bob', rating: 4, message: 'Found the course helpful, but could use more examples.', timestamp: new Date(Date.now() - 3600000).toISOString() }, // 1 hour ago
      ];
    }
  });
  const [editingItem, setEditingItem] = useState(null); // Feedback item being edited
  const [showEditModal, setShowEditModal] = useState(false);
  const [alertInfo, setAlertInfo] = useState({ show: false, variant: '', message: '' }); // For success/error messages

  // --- Persistence Effect ---
   useEffect(() => {
    // Save feedback to localStorage whenever it changes
    localStorage.setItem('learnhubFeedback', JSON.stringify(feedbackItems));
  }, [feedbackItems]);


  // --- CRUD Operations ---

  // CREATE
  const handleAddFeedback = (newItemData) => {
    const newFeedback = {
      ...newItemData,
      id: Date.now(), // Simple unique ID using timestamp
      timestamp: new Date().toISOString(), // Add current timestamp
    };
    setFeedbackItems(prevItems => [newFeedback, ...prevItems]); // Add to the beginning of the list
    showAlert('success', 'Feedback submitted successfully!');
  };

  // UPDATE (Part 1: Show Modal)
  const handleShowEditModal = (item) => {
    setEditingItem(item);
    setShowEditModal(true);
  };

  // UPDATE (Part 2: Handle Form Submission in Modal)
  const handleUpdateFeedback = (updatedItemData) => {
    setFeedbackItems(prevItems =>
      prevItems.map(item =>
        item.id === updatedItemData.id ? { ...item, ...updatedItemData, timestamp: new Date().toISOString() } : item // Update timestamp on edit
      )
    );
    setShowEditModal(false);
    setEditingItem(null);
    showAlert('info', 'Feedback updated successfully!');
  };

  // DELETE
  const handleDeleteFeedback = (id) => {
    // Optional: Add confirmation dialog
     if (window.confirm('Are you sure you want to delete this feedback?')) {
        setFeedbackItems(prevItems => prevItems.filter(item => item.id !== id));
        showAlert('danger', 'Feedback deleted.');
     }
  };

   // --- Utility Functions ---
  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditingItem(null); // Clear editing state when modal is closed
  };

  const showAlert = (variant, message) => {
    setAlertInfo({ show: true, variant, message });
    setTimeout(() => {
      setAlertInfo({ show: false, variant: '', message: '' });
    }, 3000); // Hide alert after 3 seconds
  };


  // --- Render ---
  return (
    <div className="feedback-page">
      <Container className="feedback-container">
         {alertInfo.show && (
          <Alert
            variant={alertInfo.variant}
            onClose={() => setAlertInfo({ show: false, variant: '', message: '' })}
            dismissible
            className="mb-4"
          >
            {alertInfo.message}
          </Alert>
        )}

        <Row>
          {/* Column for Adding Feedback */}
          <Col md={5} lg={4}>
            <Card className="feedback-card mb-4 mb-md-0">
              <Card.Header>Add Your Feedback</Card.Header>
              <Card.Body>
                <FeedbackForm onSubmit={handleAddFeedback} buttonText="Submit Feedback"/>
              </Card.Body>
            </Card>
          </Col>

          {/* Column for Displaying Feedback */}
          <Col md={7} lg={8}>
            <Card className="feedback-card">
               <Card.Header>Recent Feedback</Card.Header>
               {/* No padding on body if using flush ListGroup */}
               <Card.Body className="p-0">
                <FeedbackList
                  feedbackItems={feedbackItems}
                  onEdit={handleShowEditModal}
                  onDelete={handleDeleteFeedback}
                />
               </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Edit Feedback Modal */}
      <Modal show={showEditModal} onHide={handleCloseEditModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Feedback</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editingItem && ( // Ensure editingItem is not null before rendering form
            <FeedbackForm
              onSubmit={handleUpdateFeedback}
              initialData={editingItem}
              buttonText="Save Changes"
            />
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default Feedback;