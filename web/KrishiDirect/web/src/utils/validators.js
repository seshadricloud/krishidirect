// filepath: /KrishiDirect/KrishiDirect/web/src/utils/validators.js

export function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
}

export function validatePassword(password) {
    // Password must be at least 6 characters long
    return password.length >= 6;
}

export function validateRequired(value) {
    // Check if the value is not empty
    return value.trim() !== '';
}

export function validatePhoneNumber(phone) {
    // Basic phone number validation (10 digits)
    const re = /^\d{10}$/;
    return re.test(String(phone));
}

// Additional validation functions can be added here as needed.