# KrishiDirect

KrishiDirect is a full-stack application designed to connect farmers directly with consumers, providing a platform for easy access to agricultural products and services.

## Frontend

The frontend of KrishiDirect is built using React and Vite. It provides a responsive and user-friendly interface for users to interact with the application.

### Folder Structure

```
web/
├── public/
│   └── assets/
│       └── logo.svg
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── pages/
│   │   ├── index.jsx
│   │   ├── login.jsx
│   │   ├── register.jsx
│   │   ├── dashboard.jsx
│   │   └── products/
│   │       ├── index.jsx
│   │       └── [id].jsx
│   │   └── farmers/
│   │       └── index.jsx
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Button.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Card.jsx
│   │   │   └── Loader.jsx
│   │   ├── layout/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   └── Footer.jsx
│   │   ├── product/
│   │   │   └── ProductCard.jsx
│   │   └── farmer/
│   │       └── FarmerCard.jsx
│   ├── services/
│   │   ├── apiClient.js
│   │   ├── config.js
│   │   ├── authService.js
│   │   ├── farmerService.js
│   │   ├── productService.js
│   │   └── orderService.js
│   ├── hooks/
│   │   ├── useAuth.js
│   │   └── useFetch.js
│   ├── context/
│   │   └── AuthContext.jsx
│   ├── utils/
│   │   ├── helpers.js
│   │   └── validators.js
│   └── styles/
│       └── globals.css
├── package.json
└── README.md
```

### Getting Started

1. **Clone the repository:**
   ```
   git clone <repository-url>
   cd KrishiDirect/web
   ```

2. **Install dependencies:**
   ```
   npm install
   ```

3. **Run the application:**
   ```
   npm run dev
   ```

### Features

- User authentication (login and registration)
- Dashboard for users to view their information
- Product listing and details
- Farmer listing and details
- Responsive design for various devices

## Backend

The backend of KrishiDirect is built using Node.js and Express. It handles all the business logic and database interactions.

### Folder Structure

```
backend/
├── src/
│   ├── server.js
│   ├── app.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── products.js
│   │   ├── farmers.js
│   │   └── orders.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── productController.js
│   │   ├── farmerController.js
│   │   └── orderController.js
│   ├── services/
│   │   ├── authService.js
│   │   ├── productService.js
│   │   ├── farmerService.js
│   │   └── orderService.js
│   ├── models/
│   │   ├── userModel.js
│   │   ├── productModel.js
│   │   ├── farmerModel.js
│   │   └── orderModel.js
│   └── middlewares/
│       ├── authMiddleware.js
│       └── errorHandler.js
├── package.json
└── .env.example
```

### Getting Started

1. **Navigate to the backend directory:**
   ```
   cd KrishiDirect/backend
   ```

2. **Install dependencies:**
   ```
   npm install
   ```

3. **Run the application:**
   ```
   npm run dev
   ```

### Features

- User authentication with JWT
- CRUD operations for products, farmers, and orders
- Error handling middleware

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.