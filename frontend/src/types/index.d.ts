// Type definitions for the KrishiDirect application

// Define a type for Product
export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    category: string;
}

// Define a type for User
export interface User {
    id: string;
    username: string;
    email: string;
    password?: string; // Optional for security reasons
}

// Define a type for Authentication Response
export interface AuthResponse {
    token: string;
    user: User;
}

// Define a type for API Response
export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
}