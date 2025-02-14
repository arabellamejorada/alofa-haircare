# Alofa Haircare

## Project Overview

This project is an eCommerce platform designed for Alofa Haircare to provide a seamless shopping experience for users. The site allows users to browse products, manage their carts, and complete transactions with secure payment options. This also allows admin to manage products and view sales report.

## Features

- User registration and authentication
- Product browsing and search functionality
- Shopping cart and checkout process
- Payment gateway integration
- Order management and tracking
- Inventory management system
- Sales report

## Technologies Used

- **Frontend:** HTML, CSS, JavaScript, React.js, Tailwind CSS
- **Backend:** Express.js, Node.js
- **Database:** PostgreSQL
- **Version Control:** Git, GitHub

## Team Members

- Cassey Anne Gempesaw
- Arabella Grace Mejorada
- John Robert Anthony Tabudlong
Installation Guide

1. Clone the Repository

git clone https://github.com/catgempesaw/alofa-haircare.git
cd alofa-haircare

2. Set Up Environment Variables

Before running the project, create the required .env files by copying the provided examples:

cp server/.env.example server/.env
cp client/.env.example client/.env

Then, open .env in a text editor and update the values as needed.

Example .env for server

# Database Connection
DATABASE_URL=postgres://user:password@localhost:5432/db_name

# Server Port
PORT=5000

Example .env for client (if using Supabase)

VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

3. Install and Run the Frontend (Client)

cd client
npm install  # Install dependencies
npm start    # Start React app

Runs on: http://localhost:3000

4. Install and Run the E-Commerce Web UI

cd ../ecommerce-web
npm install  # Install dependencies
npm run dev  # Start development server

Runs on: http://localhost:5173

5. Install and Run the Backend (Server)

cd ../server
npm install  # Install dependencies
npm start    # Start backend server

Runs on: http://localhost:5000 (or as configured in .env)

Running the Full Application

To start the full project, open three terminals and run each section in parallel:

# Terminal 1 (Client)
cd client
npm start

# Terminal 2 (E-Commerce Web)
cd ecommerce-web
npm run dev

# Terminal 3 (Backend)
cd server
npm start

Contributing

Pull requests are welcome. Please open an issue first to discuss changes.

License

MIT

