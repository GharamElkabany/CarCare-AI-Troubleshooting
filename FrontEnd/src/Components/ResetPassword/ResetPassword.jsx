import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './ResetPassword.module.css';

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get('token');

    if (!token) {
      setMessage("Invalid or missing token. Please request a new password reset.");
      setStatus("error");
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/reset-password', { token, newPassword });

      if (response.data.Status === "Success") {
        setMessage("Password reset successful! Redirecting to login...");
        setStatus("success");
        setTimeout(() => navigate('/login'), 3000);
      } else {
        setMessage(response.data.Error || "Failed to reset password.");
        setStatus("error");
      }
    } catch (error) {
      setMessage("An error occurred. Please try again.");
      setStatus("error");
    }
  };

  return (
    <div className={styles.container}>
      <div className={`${styles.card} ${status === "success" ? styles.successCard : styles.errorCard}`}>
        <h1>Reset Password</h1>
        <p>Enter the new password for your account</p>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            className={styles.input}
          />
          <button type="submit" className={styles.btn}>Reset Password</button>
        </form>
        {message && <p className={styles.message}>{message}</p>}
      </div>
    </div>
  );
}
