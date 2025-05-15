import React, { useState, useEffect } from 'react';
import { Form, Button, FloatingLabel } from 'react-bootstrap';
import PropTypes from 'prop-types';

function FeedbackForm({ onSubmit, initialData = null, buttonText = "Submit Feedback" }) {
  const [author, setAuthor] = useState('');
  const [rating, setRating] = useState(5); // Default to 5 stars
  const [message, setMessage] = useState('');
  const [validated, setValidated] = useState(false);

  useEffect(() => {
    if (initialData) {
      setAuthor(initialData.author);
      setRating(initialData.rating);
      setMessage(initialData.message);
    } else {
      // Reset form when switching from edit to add
      setAuthor('');
      setRating(5);
      setMessage('');
    }
    setValidated(false); // Reset validation state on initial data change
  }, [initialData]);

  const handleSubmit = (event) => {
    const form = event.currentTarget;
    event.preventDefault();
    event.stopPropagation();

    if (form.checkValidity() === false) {
      setValidated(true);
    } else {
      const feedbackData = {
        author,
        rating: parseInt(rating, 10), // Ensure rating is a number
        message,
        // If initialData exists, keep its id and timestamp, otherwise they will be generated
        id: initialData ? initialData.id : undefined,
        timestamp: initialData ? initialData.timestamp : undefined,
      };
      onSubmit(feedbackData);

      // Clear form only if it's not an edit form (or let parent handle clearing)
      if (!initialData) {
        setAuthor('');
        setRating(5);
        setMessage('');
      }
       setValidated(false); // Reset validation after successful submission
    }
  };

  return (
    <Form noValidate validated={validated} onSubmit={handleSubmit} className="feedback-form">
      <FloatingLabel controlId="feedbackAuthor" label="Your Name" className="mb-3">
        <Form.Control
          required
          type="text"
          placeholder="Enter your name"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        />
        <Form.Control.Feedback type="invalid">
          Please enter your name.
        </Form.Control.Feedback>
      </FloatingLabel>

      <Form.Group controlId="feedbackRating" className="mb-3">
        <Form.Label>Rating (1-5 Stars)</Form.Label>
        <Form.Select
          aria-label="Rating"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
        >
          <option value={5}>★★★★★ (Excellent)</option>
          <option value={4}>★★★★☆ (Good)</option>
          <option value={3}>★★★☆☆ (Average)</option>
          <option value={2}>★★☆☆☆ (Fair)</option>
          <option value={1}>★☆☆☆☆ (Poor)</option>
        </Form.Select>
      </Form.Group>

      <FloatingLabel controlId="feedbackMessage" label="Your Feedback" className="mb-3">
        <Form.Control
          required
          as="textarea"
          placeholder="Leave your feedback here"
          style={{ height: '120px' }}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          minLength={10}
        />
        <Form.Control.Feedback type="invalid">
          Please enter your feedback (minimum 10 characters).
        </Form.Control.Feedback>
      </FloatingLabel>

      <Button variant="primary" type="submit" size="lg">
        {buttonText}
      </Button>
    </Form>
  );
}

FeedbackForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  initialData: PropTypes.object,
  buttonText: PropTypes.string,
};

export default FeedbackForm;