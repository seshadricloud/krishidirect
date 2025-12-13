# KrishiDirect

## Overview
KrishiDirect is a full-stack application designed to connect farmers directly with consumers, providing a platform for buying and selling agricultural products. The application consists of a frontend built with React and Vite, and a backend powered by Node.js and Express.

## Project Structure
The project is organized into two main directories: `web` for the frontend and `backend` for the backend.

### Frontend (web)
- **public/**: Contains static assets like images and icons.
- **src/**: Contains the source code for the React application.
  - **components/**: Reusable UI components.
  - **pages/**: Different pages of the application.
  - **services/**: API client and service functions for authentication, products, farmers, and orders.
  - **hooks/**: Custom hooks for managing state and fetching data.
  - **context/**: Context API for managing authentication state.
  - **utils/**: Utility functions and validators.
  - **styles/**: Global CSS styles.

### Backend (backend)
- **src/**: Contains the source code for the Node.js application.
  - **controllers/**: Logic for handling requests and responses.
  - **routes/**: API routes for authentication, products, farmers, and orders.
  - **services/**: Business logic for handling data operations.
  - **models/**: Database models for users, products, farmers, and orders.
  - **middlewares/**: Middleware for authentication and error handling.

## Getting Started

### Prerequisites
- Node.js and npm installed on your machine.
- MongoDB (or any other database) for the backend.

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd KrishiDirect
   ```

2. **Frontend Setup**
   ```bash
   cd web
   npm install
   npm run dev
   ```

3. **Backend Setup**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Update .env with your database configuration
   npm run dev
   ```

### Usage
- Access the frontend application at `http://localhost:3000`.
- The backend API will be available at `http://localhost:5000/api`.

## Features
- User authentication (login, registration).
- Product listing and details.
- Farmer profiles and information.
- Order placement and status tracking.

## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License
This project is licensed under the MIT License. See the LICENSE file for details.