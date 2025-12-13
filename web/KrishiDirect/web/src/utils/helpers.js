// filepath: KrishiDirect/KrishiDirect/web/src/utils/helpers.js

/**
 * Utility functions for the KrishiDirect application.
 */

/**
 * Format a date to a more readable string.
 * @param {Date} date - The date to format.
 * @returns {string} - Formatted date string.
 */
export function formatDate(date) {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}

/**
 * Capitalize the first letter of a string.
 * @param {string} str - The string to capitalize.
 * @returns {string} - Capitalized string.
 */
export function capitalizeFirstLetter(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Generate a unique ID for items.
 * @returns {string} - Unique ID.
 */
export function generateUniqueId() {
    return 'id-' + Math.random().toString(36).substr(2, 16);
}

/**
 * Check if an object is empty.
 * @param {Object} obj - The object to check.
 * @returns {boolean} - True if the object is empty, false otherwise.
 */
export function isEmptyObject(obj) {
    return Object.keys(obj).length === 0;
}