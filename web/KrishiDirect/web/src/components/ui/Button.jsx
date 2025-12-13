import React from 'react';
import PropTypes from 'prop-types';

// Button component for reusable button functionality
const Button = ({ onClick, children, type = 'button', className = '', disabled = false }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`btn ${className}`}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

// PropTypes for type checking
Button.propTypes = {
  onClick: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  type: PropTypes.string,
  className: PropTypes.string,
  disabled: PropTypes.bool,
};

// Default export for the Button component
export default Button;