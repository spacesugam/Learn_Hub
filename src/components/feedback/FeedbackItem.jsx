import React from 'react';
import { ListGroup, Button, Badge } from 'react-bootstrap';
import PropTypes from 'prop-types';

function FeedbackItem({ item, onEdit, onDelete }) {
  const renderStars = (rating) => {
    const fullStars = '★'.repeat(rating);
    const emptyStars = '☆'.repeat(5 - rating);
    return fullStars + emptyStars;
  };

  const formatTimestamp = (timestamp) => {
      if (!timestamp) return '';
      try {
        return new Date(timestamp).toLocaleString();
      } catch (e) {
        return 'Invalid Date';
      }
  }

  return (
    <ListGroup.Item as="li" className="d-flex flex-column">
        <div className="feedback-item-header">
            <div>
                <span className="feedback-author me-2">{item.author || 'Anonymous'}</span>
                <Badge pill bg="light" text="dark" className="feedback-rating">
                    {renderStars(item.rating)}
                </Badge>
            </div>
             <small className="feedback-timestamp">{formatTimestamp(item.timestamp)}</small>
        </div>

        <p className="feedback-message mb-2">{item.message}</p>

        <div className="feedback-actions align-self-end">
            <Button
            variant="outline-secondary"
            size="sm"
            onClick={() => onEdit(item)}
            aria-label={`Edit feedback from ${item.author}`}
            >
             <i className="fas fa-pencil-alt"></i> Edit
            </Button>
            <Button
            variant="outline-danger"
            size="sm"
            onClick={() => onDelete(item.id)}
            aria-label={`Delete feedback from ${item.author}`}
            >
            <i className="fas fa-trash"></i> Delete
            </Button>
      </div>
    </ListGroup.Item>
  );
}

FeedbackItem.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    author: PropTypes.string.isRequired,
    rating: PropTypes.number.isRequired,
    message: PropTypes.string.isRequired,
    timestamp: PropTypes.oneOfType([PropTypes.string, PropTypes.number]), // Can be ISO string or timestamp number
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default FeedbackItem;