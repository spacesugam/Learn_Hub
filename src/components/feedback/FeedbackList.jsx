import React from 'react';
import { ListGroup } from 'react-bootstrap';
import FeedbackItem from './FeedbackItem';
import PropTypes from 'prop-types';

function FeedbackList({ feedbackItems, onEdit, onDelete }) {
  if (!feedbackItems || feedbackItems.length === 0) {
    return <p className="text-center text-muted mt-4">No feedback submitted yet. Be the first!</p>;
  }

  return (
    <ListGroup variant="flush" className="feedback-list-group">
      {feedbackItems.map((item) => (
        <FeedbackItem
          key={item.id}
          item={item}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </ListGroup>
  );
}

FeedbackList.propTypes = {
  feedbackItems: PropTypes.arrayOf(PropTypes.object).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default FeedbackList;