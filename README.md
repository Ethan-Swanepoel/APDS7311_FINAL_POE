# Customer International Payments Portal

This project is a web-based application designed to enable customers to register, login, and perform secure international payments. Employees can log in to verify and approve payments, completing transactions via SWIFT. The portal uses MongoDB for data storage, Node.js/Express for the backend API, and React for the frontend. 

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Setup Instructions](#setup-instructions)
- [Folder Structure](#folder-structure)
- [API Endpoints](#api-endpoints)
- [Known Issues](#known-issues)
- [Future Improvements](#future-improvements)

## Features
- **Customer Registration**: Customers can register by providing their full name, ID number, account number, and password.
- **Customer Login**: Login to access the payment dashboard.
- **Payment Processing**: Customers can submit payments by providing details like amount, currency, provider, and SWIFT code.
- **Employee Login**: Employees can log in to verify payments and approve them.
- **SWIFT Integration**: Employees can submit payments to SWIFT after verification.

## Tech Stack
- **Frontend**: React (with React Router for navigation)
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Security**: Bcrypt (for password hashing), SSL (for secure connections)
- **API Testing**: Postman
- **Version Control**: Git & GitHub

## Setup Instructions

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Ethan-Swanepoel/APDS7311_FINAL_POE.git
   cd apds7311-part-2-Ethan-Swanepoel
   ```

2. **Install Dependencies**:
   Navigate to both the backend and frontend directories and run the following command:
   ```bash
   npm install
   ```

3. **Backend Setup**:
   - Configure your MongoDB connection string in the `.env` file.
   - Start the backend server:
     ```bash
     cd backend
     npm start
     ```

4. **Frontend Setup**:
   - Start the frontend development server:
     ```bash
     cd frontend
     npm start
     ```

5. **Running the Application**:
   - Visit `http://localhost:3000` in your browser to access the app.

## Folder Structure
```bash
├── backend
│   ├── controllers
│   ├── models
│   ├── routes
│   └── app.js
├── frontend
│   ├── public
│   ├── src
│   │   ├── components
│   │   └── App.js
├── .env
└── README.md
```

## API Endpoints
### Customer Routes:
- **POST** `/customer/register_customer_details`: Register a new customer.
- **POST** `/customer/login`: Login customer and verify credentials.
- **POST** `/customer/payment`: Make a new payment.

### Employee Routes:
- **POST** `/employee/login`: Login employee and verify credentials.
- **GET** `/employee/payments`: Fetch all customer payments for verification.
- **POST** `/employee/verify-payment`: Verify a customer’s payment.

## Known Issues
- Error handling for network or server issues is basic and can be improved.
- More detailed validation for inputs could be implemented.

## Future Improvements
- Implement role-based access control (RBAC) for added security.
- Add unit and integration tests for both the frontend and backend.
- Integrate with SWIFT's API for direct submission.

---

