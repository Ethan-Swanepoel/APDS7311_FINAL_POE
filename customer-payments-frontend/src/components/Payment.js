import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Payment() {
  const [recipientAccount, setRecipientAccount] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('');
  const [provider, setProvider] = useState('');
  const [swiftCode, setSwiftCode] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate

  const handlePayment = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://localhost:3001/payment/register_payment_details', {
        recipient_account: recipientAccount,
        amount: amount,
        currency: currency,
        provider: provider,
        swift_code: swiftCode,
      });
      setMessage('Payment confirmed!');
      // Redirect to the dashboard after a short delay to show the message
      setTimeout(() => {
        navigate('/'); // Change to your dashboard route
      }, 2000); // Adjust the delay as needed
    } catch (error) {
      setMessage('Payment failed. Please try again.');
      console.error('Payment failed', error);
    }
  };

  return (
    <div>
      <h2>Make a Payment</h2>
      <form onSubmit={handlePayment}>
        <label>
          Recipient Account:
          <input 
            type="text" 
            value={recipientAccount} 
            onChange={(e) => setRecipientAccount(e.target.value)} 
            required 
          />
        </label>
        <label>
          Amount:
          <input 
            type="number" 
            value={amount} 
            onChange={(e) => setAmount(e.target.value)} 
            required 
          />
        </label>
        <label>
          Currency:
          <input 
            type="text" 
            value={currency} 
            onChange={(e) => setCurrency(e.target.value)} 
            required 
          />
        </label>
        <label>
          Provider:
          <input 
            type="text" 
            value={provider} 
            onChange={(e) => setProvider(e.target.value)} 
            required 
          />
        </label>
        <label>
          SWIFT Code:
          <input 
            type="text" 
            value={swiftCode} 
            onChange={(e) => setSwiftCode(e.target.value)} 
            required 
          />
        </label>
        <button type="submit">Pay Now</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default Payment;
