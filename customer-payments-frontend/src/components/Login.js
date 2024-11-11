import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [fullName, setFullName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  // Function to update the form inputs
  const updateForm = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case 'fullName':
        setFullName(value);
        break;
      case 'accountNumber':
        setAccountNumber(value);
        break;
      case 'password':
        setPassword(value);
        break;
      default:
        break;
    }
  };

  // Function to handle form submission
  const handleLogin = async (e) => {
    e.preventDefault();
    const newCustomer = {
      full_name: fullName,
      account_num: accountNumber,
      password: password,
    };

    try {
      const response = await fetch('https://localhost:3001/customer/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCustomer),
      });

      if (!response.ok) {
        throw new Error('Login failed. Please check your details and try again.');
      }

      const data = await response.json();
      setMessage('Login successful! Redirecting to payment page...');
      setTimeout(() => navigate('/payment'), 2000);
    } catch (error) {
      setMessage(error.message);
      console.error('Login failed', error);
    }
  };

  return (
    <div>
      <h2>Customer Login</h2>
      <form onSubmit={handleLogin}>
        <label>
          Full Name:
          <input
            type="text"
            name="fullName"
            value={fullName}
            onChange={updateForm}
            required
          />
        </label>
        <label>
          Account Number:
          <input
            type="text"
            name="accountNumber"
            value={accountNumber}
            onChange={updateForm}
            required
          />
        </label>
        <label>
          Password:
          <input
            type="password"
            name="password"
            value={password}
            onChange={updateForm}
            required
          />
        </label>
        <button type="submit">Login</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
