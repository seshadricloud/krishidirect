#!/bin/bash
# start.sh - Script to start the KrishiDirect application

# Navigate to the backend directory and start the server
echo "Starting the backend server..."
cd backend
npm install
npm run start &

# Navigate to the frontend directory and start the development server
echo "Starting the frontend development server..."
cd ../frontend
npm install
npm run dev &

# Wait for both servers to start
wait
echo "KrishiDirect application is running!"