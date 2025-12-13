# KrishiDirect Application

## Overview
KrishiDirect is a full-stack application designed to connect farmers directly with consumers, facilitating the buying and selling of agricultural products. This README provides an overview of the project, setup instructions, and usage guidelines.

## Table of Contents
- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)
- [Setup Instructions](#setup-instructions)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Technologies Used
- **Frontend:** React, Vite, TypeScript
- **Backend:** Node.js, Express, TypeScript, Prisma
- **Database:** PostgreSQL (or any other supported database)
- **Containerization:** Docker

## Project Structure
```
KrishiDirect
├── README.md
├── .gitignore
├── docker-compose.yml
├── .env.example
├── frontend
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   ├── index.html
│   ├── public
│   │   └── favicon.svg
│   └── src
│       ├── main.tsx
│       ├── App.tsx
│       ├── pages
│       │   ├── Home.tsx
│       │   ├── Marketplace.tsx
│       │   └── Dashboard.tsx
│       ├── components
│       │   ├── Header.tsx
│       │   ├── Footer.tsx
│       │   ├── ProductCard.tsx
│       │   └── Form
│       │       └── Input.tsx
│       ├── hooks
│       │   └── useAuth.ts
│       ├── services
│       │   └── api.ts
│       ├── store
│       │   └── index.ts
│       ├── styles
│       │   └── globals.css
│       └── types
│           └── index.d.ts
├── backend
│   ├── package.json
│   ├── tsconfig.json
│   ├── nodemon.json
│   ├── .env.example
│   ├── prisma
│   │   ├── schema.prisma
│   │   └── migrations
│   │       └── README.md
│   └── src
│       ├── server.ts
│       ├── app.ts
│       ├── controllers
│       │   ├── auth.controller.ts
│       │   └── product.controller.ts
│       ├── routes
│       │   ├── index.ts
│       │   ├── auth.routes.ts
│       │   └── products.routes.ts
│       ├── services
│       │   └── product.service.ts
│       ├── models
│       │   └── product.model.ts
│       ├── middlewares
│       │   ├── auth.middleware.ts
│       │   └── error.middleware.ts
│       ├── config
│       │   └── index.ts
│       ├── utils
│       │   └── logger.ts
│       └── types
│           └── index.d.ts
└── scripts
    ├── start.sh
    └── setup.sh
```

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- Docker and Docker Compose
- PostgreSQL (or any other database of your choice)

### Frontend Setup
1. Navigate to the `frontend` directory:
   ```
   cd frontend
   ```
2. Install dependencies:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npm run dev
   ```

### Backend Setup
1. Navigate to the `backend` directory:
   ```
   cd backend
   ```
2. Install dependencies:
   ```
   npm install
   ```
3. Set up the database:
   - Copy `.env.example` to `.env` and configure your database connection by setting the following variables for PostgreSQL:
     - `DB_USER`: your database username
     - `DB_PASSWORD`: your database password
     - `DB_HOST`: your database host (e.g., `localhost`)
     - `DB_PORT`: your database port (default is `5432`)
     - `DB_NAME`: your database name
4. Run migrations:
   ```
   npx prisma migrate dev
   ```
5. Start the server:
   ```
   npm run start
   ```

### Docker Setup
To run the application using Docker, use the following command in the root directory:
```
docker-compose up
```

## Usage
- Access the frontend application at `http://localhost:3000`.
- The backend API can be accessed at `http://localhost:5000/api`.

## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License
This project is licensed under the MIT License. See the LICENSE file for details.