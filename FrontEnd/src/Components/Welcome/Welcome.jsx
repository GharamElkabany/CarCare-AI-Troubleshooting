import React from 'react';
import styles from './Welcome.module.css';
import { Link } from 'react-router-dom';

export default function Welcome() {
  return <>

    <div className="container mt-5">
      <h1>Welcome to Our System!</h1>
      <p>This is a simple introduction to the system.</p>
      <p>Please log in or register to get started.</p>

      <div>
        <Link to="/login" className="btn btn-primary mx-2">Login</Link>
        <Link to="/register" className="btn btn-secondary mx-2">Register</Link>
      </div>
    </div>
    
  </>
}
