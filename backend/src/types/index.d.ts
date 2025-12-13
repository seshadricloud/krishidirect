// Type definitions for the KrishiDirect backend application

// User type definition
export interface User {
    id: string;
    username: string;
    email: string;
    password: string; // Consider using a hashed password in production
    createdAt: Date;
    updatedAt: Date;
}

// Product type definition
export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    quantity: number;
    createdAt: Date;
    updatedAt: Date;
}

// Response type for API calls
export interface ApiResponse<T> {
    success: boolean;
    message?: string;
    data?: T;
}

// Authentication token payload
export interface AuthTokenPayload {
    userId: string;
    username: string;
    iat: number; // Issued at
    exp: number; // Expiration time
}