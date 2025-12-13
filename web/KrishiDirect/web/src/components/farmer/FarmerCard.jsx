import React from 'react';

// FarmerCard component to display individual farmer information
const FarmerCard = ({ farmer }) => {
  return (
    <div className="farmer-card">
      <h3>{farmer.name}</h3>
      <p>{farmer.location}</p>
      <p>{farmer.experience} years of experience</p>
      <p>{farmer.products.join(', ')}</p>
      <button className="view-profile">View Profile</button>
    </div>
  );
};

export default FarmerCard;