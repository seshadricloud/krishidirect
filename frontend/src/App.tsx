import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Marketplace from './pages/Marketplace';
import Dashboard from './pages/Dashboard';
import './styles/globals.css';

/**
 * Main application component that sets up routing and layout.
 */
const App: React.FC = () => {
    return (
        <Router>
            <Header />
            <main>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/marketplace" element={<Marketplace />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                </Routes>
            </main>
            <Footer />
        </Router>
    );
};

export default App;