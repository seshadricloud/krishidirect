import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../public/assets/logo.svg'; // Import the logo

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">
          <img src={logo} alt="KrishiDirect Logo" className="logo" />
        </Link>
      </div>
      <ul className="navbar-links">
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/login">Login</Link>
        </li>
        <li>
          <Link to="/register">Register</Link>
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
      </ul>
    </nav>
  );
};

export default Navbar;