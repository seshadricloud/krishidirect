import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/globals.css';

// Create a root element for the React application
const rootElement = document.getElementById('root');

// Ensure the root element exists before rendering
if (rootElement) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
        <React.StrictMode>
            <App />
        </React.StrictMode>
    );
} else {
    console.error('Root element not found. Ensure there is an element with id "root" in index.html.');
}