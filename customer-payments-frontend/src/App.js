import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import EmployeeLogin from './components/EmployeeLogin';
import Register from './components/Register';
import Payment from './components/Payment';
import Dashboard from './components/Dashboard';
import Swift from './components/Swift';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
        <Route path="/" element={<Dashboard />} />
          <Route path="/employee-login" element={<EmployeeLogin />} />
          <Route path="/register" element={<Register />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/login" element={<Login />} />
          <Route path="/swift" element={<Swift />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
