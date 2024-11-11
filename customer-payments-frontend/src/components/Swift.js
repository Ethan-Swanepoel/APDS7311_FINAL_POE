import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Swift() {
  const [payments, setPayments] = useState([]);
  const [statusList, setStatusList] = useState({});
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  // Fetch payment details when the component loads
  useEffect(() => {
    async function fetchPayments() {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setMessage("Session expired. Please log in again.");
          return navigate('/login');
        }

        const response = await fetch('https://localhost:3001/payment/get_payment_details', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
        });

        const data = await response.json();

        if (response.ok) {
          setPayments(data);

          // Initialize status list for each payment with "Unverified"
          const initialStatus = {};
          data.forEach(payment => {
            initialStatus[payment._id] = 'Unverified';
          });
          setStatusList(initialStatus);

        } else if (response.status === 401) {
          setMessage("Token invalid or session expired. Please log in again.");
          localStorage.removeItem('token');
          navigate('/login');
        } else {
          console.error("Failed to fetch payments:", data.message);
        }
      } catch (error) {
        console.error("Error fetching payments:", error);
        setMessage("Error fetching payments. Please try again.");
      }
    }

    fetchPayments();
  }, [navigate]);

  // Handle status change in the combobox
  const handleStatusChange = (paymentId, newStatus) => {
    setStatusList(prevStatus => ({
      ...prevStatus,
      [paymentId]: newStatus
    }));
  };

  // Handle "Submit to SWIFT" button click
  const submitToSwift = () => {
    // Perform submission logic (e.g., marking payments as verified)
    console.log("Submitting payments to SWIFT:", statusList);

    // For now, redirect to the Dashboard after submitting
    navigate('/');
  };

  return (
    <div>
      <h2>SWIFT Payments Verification</h2>

      {message && <p style={{ color: 'red' }}>{message}</p>} {/* Display any error messages */}

      <div className="payments-list">
        {payments.length === 0 ? (
          <p>No payments available for verification.</p>
        ) : (
          payments.map((payment) => (
            <div key={payment._id} className="payment-item">
              <p><strong>Recipient Account:</strong> {payment.account_num}</p>
              <p><strong>Amount:</strong> {payment.amount}</p>
              <p><strong>Currency:</strong> {payment.currency}</p>
              <p><strong>Provider:</strong> {payment.provider}</p>
              <p><strong>SWIFT Code:</strong> {payment.swift_code}</p>
              <p><strong>Status:</strong></p>
              <select
                value={statusList[payment._id] || 'Unverified'}
                onChange={(e) => handleStatusChange(payment._id, e.target.value)}
              >
                <option value="Unverified">Unverified</option>
                <option value="Verified">Verified</option>
              </select>
            </div>
          ))
        )}
      </div>

      {payments.length > 0 && (
        <button onClick={submitToSwift} style={{ marginTop: '20px' }}>
          Submit to SWIFT
        </button>
      )}
    </div>
  );
}
