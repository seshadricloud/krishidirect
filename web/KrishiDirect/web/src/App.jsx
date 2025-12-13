import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/index';
import Login from './pages/login';
import Register from './pages/register';
import Dashboard from './pages/dashboard';
import Products from './pages/products/index';
import ProductDetail from './pages/products/[id]';
import Farmers from './pages/farmers/index';
import './styles/globals.css';

const App = () => {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/farmers" element={<Farmers />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;