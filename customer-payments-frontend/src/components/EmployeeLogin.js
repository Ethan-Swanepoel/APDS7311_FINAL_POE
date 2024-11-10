import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function EmployeeLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage(''); // Clear any previous error message

    try {
      const response = await axios.post('http://localhost:3001/employee/login', {
        username: username,
        password: password,
      });

      if (response.status === 200) {
        const token = response.data.token; // Assuming the token is in the response
        localStorage.setItem('token', token); // Store token in localStorage

        // Handle successful login and navigate to SWIFT page
        navigate('/swift');
      } else {
        setErrorMessage('Invalid login credentials.');
      }
    } catch (error) {
      // Handle any error that occurs during login
      console.error('Login failed', error);
      setErrorMessage('Login failed. Please check your credentials and try again.');
    }
  };

  return (
    <div>
      <h2>Employee Login</h2>

      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>} {/* Display error message if login fails */}

      <form onSubmit={handleLogin}>
        <label>
          Username:
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <br />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default EmployeeLogin;
