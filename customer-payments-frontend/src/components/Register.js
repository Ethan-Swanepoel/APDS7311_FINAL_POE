import React, { useState } from 'react';
import { useNavigate } from 'react-router';

export default function Register() {
  const [form, setForm] = useState({
    full_name: '',
    identification_num: '',
    account_num: '',
    password: '',
  });

  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  // Function to update form state dynamically
  function updateForm(event) {
    const { name, value } = event.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  }

  // Async function to handle form submission
  async function onSubmit(event) {
    event.preventDefault();

    const newCustomer = {
      full_name: form.full_name,
      identification_num: form.identification_num,
      account_num: form.account_num,
      password: form.password,
    };

    try {
      console.log('Attempting to register:', newCustomer);

      const response = await fetch('https://localhost:3001/customer/register_customer_details', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCustomer),
      });

      const data = await response.json();

      if (response.ok) {
        // Set success message and redirect to login
        setMessage('Registration successful! Redirecting to login...');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        // Set error message based on response from server
        setMessage(data.message || 'Registration failed. Please try again.');
      }
    } catch (error) {
      // Log the error for debugging
      console.error('Registration error:', error.message);

      // Set error message
      setMessage('Registration failed due to server error. Please try again.');
    }
  }

  return (
    <div>
      <h2>Customer Registration</h2>
      <form onSubmit={onSubmit}>
        <label>
          Full Name:
          <input
            type="text"
            name="full_name"
            value={form.full_name}
            onChange={updateForm}
            required
          />
        </label>
        <label>
          ID Number:
          <input
            type="text"
            name="identification_num"
            value={form.identification_num}
            onChange={updateForm}
            required
          />
        </label>
        <label>
          Account Number:
          <input
            type="text"
            name="account_num"
            value={form.account_num}
            onChange={updateForm}
            required
          />
        </label>
        <label>
          Password:
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={updateForm}
            required
          />
        </label>
        <button type="submit">Register</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
