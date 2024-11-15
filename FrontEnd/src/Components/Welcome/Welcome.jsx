import React from 'react';
import styles from './Welcome.module.css';
import { Link } from 'react-router-dom';

export default function Welcome() {
  return <>

    <div className={`${styles.welcomeContainer} align-items-center justify-content-center`}>
      <div className={`${styles.heroSection} text-center text-white`}>
        <h1>Welcome to CarCare</h1>
        <h3>Your Personal Car Troubleshooting</h3>
        <p>
          CarCare helps you diagnose and fix common vehicle issues with easy to
          follow guides and AI-powered solutions.
        </p>
        <div className="mt-3">
          <Link to="/login" className={`${styles.btnCustom} btn btn-success mx-2`}>Login</Link>
          <Link to="/register" className={`${styles.btnCustom} btn btn-success mx-2`}>Register</Link>
        </div>
      </div>
    </div>  
    
  </>
}
