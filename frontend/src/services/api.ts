import axios from 'axios';

// Create an Axios instance with default settings
const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api', // Base URL for API requests
    timeout: 10000, // Request timeout in milliseconds
    headers: {
        'Content-Type': 'application/json', // Default content type for requests
    },
});

// Interceptor to handle requests
api.interceptors.request.use(
    (config) => {
        // You can add authorization tokens or other headers here
        const token = localStorage.getItem('token'); // Example: get token from local storage
        if (token) {
            config.headers.Authorization = `Bearer ${token}`; // Attach token to headers
        }
        return config; // Return the modified config
    },
    (error) => {
        return Promise.reject(error); // Handle request error
    }
);

// Interceptor to handle responses
api.interceptors.response.use(
    (response) => {
        return response.data; // Return only the data from the response
    },
    (error) => {
        // Handle errors globally
        console.error('API Error:', error); // Log the error
        return Promise.reject(error); // Reject the promise with the error
    }
);

export default api; // Export the Axios instance for use in other parts of the application