#!/bin/bash

# KrishiDirect Setup Script
# This script sets up the development environment for the KrishiDirect application.

# Exit immediately if a command exits with a non-zero status
set -e

# Function to install frontend dependencies
install_frontend() {
  echo "Installing frontend dependencies..."
  cd frontend
  npm install
  cd ..
}

# Function to install backend dependencies
install_backend() {
  echo "Installing backend dependencies..."
  cd backend
  npm install
  cd ..
}

# Function to set up environment variables
setup_env() {
  echo "Setting up environment variables..."
  cp .env.example .env
  cp backend/.env.example backend/.env
}

# Main setup function
main() {
  echo "Starting setup for KrishiDirect..."

  install_frontend
  install_backend
  setup_env

  echo "Setup completed successfully!"
}

# Run the main setup function
main