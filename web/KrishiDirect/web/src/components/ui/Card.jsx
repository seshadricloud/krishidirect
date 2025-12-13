import React from 'react';
import './Card.css'; // Assuming you have a CSS file for styling

const Card = ({ title, content, footer }) => {
  return (
    <div className="card">
      <div className="card-header">
        <h3>{title}</h3>
      </div>
      <div className="card-body">
        <p>{content}</p>
      </div>
      {footer && (
        <div className="card-footer">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;