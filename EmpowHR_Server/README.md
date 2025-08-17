# EmpowHR Server

## Description

EmpowHR Server is a backend service for managing HR-related operations such as user registration, worksheet management, payment processing, and more. It is built using Node.js, Express, MongoDB, and Stripe.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Scripts](#scripts)
- [Dependencies](#dependencies)
- [DevDependencies](#devdependencies)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Deployment](#deployment)
- [License](#license)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/
   cd empowhr-server
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add the following environment variables:
   ```plaintext
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/empowhr
   STRIPE_SECRET_KEY=your_stripe_secret_key
   CLIENT_URL=http://localhost:5173
   ```

## Usage

To start the server, run:
```bash
npm start
```

For development with auto-reloading, run:
```bash
npm run dev
```

## Scripts

- `start`: Starts the server using Node.js.
- `dev`: Starts the server with Nodemon for development.
- `seed`: Seeds the database with initial data.

## Dependencies

- `express`: Web framework for Node.js.
- `cors`: Middleware for enabling CORS.
- `mongodb`: MongoDB driver for Node.js.
- `dotenv`: Module for loading environment variables from a `.env` file.
- `stripe`: Stripe API library for Node.js.

## DevDependencies

- `nodemon`: Utility that monitors for changes in your source code and automatically restarts your server.

## Environment Variables

- `PORT`: The port on which the server will run.
- `MONGODB_URI`: The URI for connecting to the MongoDB database.
- `STRIPE_SECRET_KEY`: The secret key for Stripe API.
- `CLIENT_URL`: The URL of the client application.

## API Endpoints

### User Routes

- `POST /api/users/register`: Register a new user.
- `GET /api/users/:email`: Get user by email.
- `GET /api/employees`: Get all employees (HR route).
- `GET /api/users`: Get all users (Admin route).
- `PUT /api/users/:id`: Update user details (Admin route).
- `PATCH /api/users/:id/fire`: Fire employee (Admin route).
- `PATCH /api/users/:id/promote`: Promote employee to HR (Admin route).
- `PATCH /api/users/:id/verify`: Update user verification status (HR route).

### Worksheet Routes

- `POST /api/worksheets`: Add a new worksheet.
- `GET /api/worksheets/:email`: Get worksheets by user email.
- `PUT /api/worksheets/:id`: Update worksheet.
- `DELETE /api/worksheets/:id`: Delete worksheet.

### Payment Routes

- `GET /api/payments/:email`: Get payments by user email.
- `POST /api/payroll-requests`: Create a payroll request (HR endpoint).
- `GET /api/payroll-requests`: Get all payroll requests (Admin endpoint).
- `POST /api/create-checkout-session`: Create Stripe Checkout Session for Salary Payment.
- `POST /api/confirm-stripe-payment`: Process Stripe Payment Completion.
- `GET /api/checkout-session/:sessionId`: Get Stripe Checkout Session details.
- `POST /api/process-payment`: Process salary payment with comprehensive duplicate prevention.

### Sync Routes

- `POST /api/users/sync`: Sync user between Firebase and MongoDB with duplicate prevention.

### Statistics Routes

- `GET /api/users/statistics`: Get comprehensive system statistics (Admin route).
- `GET /api/activities/recent`: Get recent system activities (Admin route).

### Contact Routes

- `POST /api/contacts`: Submit a contact form message.

## Deployment

The project is configured for deployment on Vercel. The `vercel.json` file specifies the build configuration and routes.

## License

This project is licensed under the MIT License.
