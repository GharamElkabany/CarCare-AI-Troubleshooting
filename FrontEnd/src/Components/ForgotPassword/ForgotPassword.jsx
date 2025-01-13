import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from './ForgotPassword.module.css';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/forgot-password', { email });
      setMessage(response.data.Message || response.data.Error);
      setStatus(response.data.Status === "Success" ? "success" : "error");
    } catch (error) {
      setMessage("An error occurred. Please try again.");
      setStatus("error");
    }
  };

  return (
    <div className={styles.container}>
      <div className={`${styles.card} ${status === "success" ? styles.successCard : styles.errorCard}`}>
        <h1>Forgot Password ?</h1>
        <p>Provide the email address associated with your account to recover your password</p>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={styles.input}
          />
          <button type="submit" className={styles.btn}>Send Reset Link</button>
        </form>
        {message && <p className={styles.message}>{message}</p>}
      </div>
    </div>
  );
}
