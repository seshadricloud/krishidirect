import React from 'react';

const Dashboard = () => {
  return (
    <div className="dashboard">
      <h1>Welcome to KrishiDirect Dashboard</h1>
      <p>This is your dashboard where you can manage your account and view your activities.</p>
      {/* Placeholder for user-specific information */}
      <div className="user-info">
        <h2>Your Information</h2>
        <p>Name: [User's Name]</p>
        <p>Email: [User's Email]</p>
      </div>
      {/* Placeholder for additional dashboard features */}
      <div className="dashboard-features">
        <h2>Features</h2>
        <ul>
          <li>View Products</li>
          <li>Manage Orders</li>
          <li>Contact Farmers</li>
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;