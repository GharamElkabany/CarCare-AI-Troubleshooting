import React from 'react';
import styles from './Navbar.module.css';
import logo from '../../assets/images/logo.png';
import { Link } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';


export default function Navbar({ auth, role }) {


  return <>

    <nav className={`navbar navbar-expand-sm navbar-light bg-dark text-muted-white ${styles.fixedNavbar}`}>
      <div className="container">
        
          <img src={logo} alt="" />
        
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
          <ul className="navbar-nav me-auto mt-2 mt-lg-0 ms-5">
            
            {auth &&
            <>
              <li className="nav-item mx-3">
                <HashLink
                   smooth
                   className="nav-link text-muted-white" 
                   to="/home#home">
                  Home
                </HashLink>
              </li>

              <li className="nav-item mx-3">
                <HashLink 
                   smooth
                   className="nav-link text-muted-white" 
                   to="/home#about">
                  About Us
                </HashLink>
              </li>

              <li className="nav-item mx-3">
                <HashLink 
                  smooth
                  className="nav-link text-muted-white" 
                  to="/home#faq">
                 FAQ
                </HashLink>
              </li>
              
              {role === 'user' && (
                <>
                  <li className="nav-item mx-3">
                    <HashLink 
                      smooth
                      className="nav-link text-muted-white" 
                      to="/home#feedback">
                      Feedback
                    </HashLink>
                  </li>
                </>)}  

              <li className="nav-item mx-3">
                <HashLink 
                   smooth
                   className="nav-link text-muted-white" 
                   to="/diagnostics">
                  AI Diagnostics
                </HashLink>
              </li>
            </>
            }

            {auth && role === 'admin' && (
              <>
                <li className="nav-item mx-3">
                  <Link className="nav-link text-muted-white" to="/adminUsers">Users</Link>
                </li>
                <li className="nav-item mx-3">
                  <Link className="nav-link text-muted-white"  to="/adminFeedbacks">Feedbacks</Link>
                </li>
              </>
            )}
            
          </ul>

          <ul className="navbar-nav ms-5 mt-2 mt-lg-0">
            {auth && 
              <li className="nav-item">
                <Link className="nav-link text-muted-white" to="/Profile">
                  <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-person-circle" viewBox="0 0 16 16">
                    <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/>
                    <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"/>
                  </svg>
                </Link>
              </li>
            }
            
          </ul>
          
        </div>
      </div>
    </nav>
    

  </>
}
