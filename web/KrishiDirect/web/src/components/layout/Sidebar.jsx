import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../public/assets/logo.svg'; // Import the logo

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <img src={logo} alt="KrishiDirect Logo" />
      </div>
      <nav className="sidebar-nav">
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/dashboard">Dashboard</Link>
          </li>
          <li>
            <Link to="/products">Products</Link>
          </li>
          <li>
            <Link to="/farmers">Farmers</Link>
          </li>
          <li>
            <Link to="/login">Login</Link>
          </li>
          <li>
            <Link to="/register">Register</Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;