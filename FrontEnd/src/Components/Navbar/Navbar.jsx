import React from 'react'
import styles from './Navbar.module.css';
import logo from '../../assets/images/logo.png'
import { Link } from 'react-router-dom';
import axios from 'axios';


export default function Navbar({ auth, handleLogout }) {

  return <>
    
    <nav className="navbar navbar-expand-sm navbar-light bg-dark text-muted-white">
      <div className="container">
        <Link className="navbar-brand" to="/">
          <img src={logo} alt="" />
        </Link>
        <button
          className="navbar-toggler d-lg-none"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#collapsibleNavId"
          aria-controls="collapsibleNavId"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="collapsibleNavId">
          <ul className="navbar-nav me-auto mt-2 mt-lg-0">
            
            {auth &&
            <>
              <li className="nav-item mx-3">
                <Link className="nav-link text-muted-white" to="/home">Home</Link>
              </li>
              <li className="nav-item mx-3">
                <Link className="nav-link text-muted-white" to="/about">About Us</Link>
              </li>
              <li className="nav-item mx-3">
                <Link className="nav-link text-muted-white" to="/faq">FAQ</Link>
              </li>
              <li className="nav-item mx-3">
                <Link className="nav-link text-muted-white" to="/feedback">Feedback</Link>
              </li>
              <li className="nav-item mx-3">
                <Link className="nav-link text-muted-white" to="/diagnostics">AI Diagnostics</Link>
              </li>
            </>
            }
            
          </ul>

          <ul className="navbar-nav ms-auto mt-2 mt-lg-0">

            {auth && 
              <li className="nav-item">
                <Link className="nav-link text-muted-white" to="/" onClick={handleLogout}>Logout</Link>
              </li>
            }

          </ul>
          
        </div>
      </div>
    </nav>
    

  </>
}
