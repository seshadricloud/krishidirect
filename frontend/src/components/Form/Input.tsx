// Input.tsx
import React from 'react';

// Define the props for the Input component
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string; // Optional label for the input
    error?: string; // Optional error message
}

// Input component for forms
const Input: React.FC<InputProps> = ({ label, error, ...props }) => {
    return (
        <div className="input-container">
            {label && <label className="input-label">{label}</label>}
            <input className={`input-field ${error ? 'input-error' : ''}`} {...props} />
            {error && <span className="input-error-message">{error}</span>}
        </div>
    );
};

export default Input;