import React from 'react';
import { Link } from 'react-router-dom';

function Dashboard() {
  return (
    <div>
      <h2>Dashboard</h2>
      <p>Welcome to your account dashboard!</p>
      <ul>
        <li><Link to="/register">Customer Registration</Link></li>
        <li><Link to="/login">Customer Login</Link></li>
        <li><Link to="/employee-login">Employee Login</Link></li>
      </ul>
    </div>
  );
}

export default Dashboard;
