import React from 'react';

const Header: React.FC = () => {
    return (
        <header className="header">
            <div className="container">
                <h1 className="logo">KrishiDirect</h1>
                <nav className="navigation">
                    <ul>
                        <li><a href="/">Home</a></li>
                        <li><a href="/marketplace">Marketplace</a></li>
                        <li><a href="/dashboard">Dashboard</a></li>
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default Header;