import React from 'react';
import './Loader.css'; // Importing CSS for styling the loader

const Loader = () => {
  return (
    <div className="loader">
      <div className="spinner"></div>
      <p>Loading...</p>
    </div>
  );
};

export default Loader;