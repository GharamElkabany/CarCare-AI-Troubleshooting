import React, { useState , useEffect } from 'react';
import styles from './Layout.module.css';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import { Outlet, useLocation } from 'react-router-dom';
import axios from 'axios';

export default function Layout({ role }) {
  const [auth, setAuth] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (location.pathname.startsWith("/verify-email")) {
      return;
    }

    axios.get('http://localhost:5000')
      .then(res => {
        if (res.data.Status === 'Success') {
          setAuth(true);
        } else {
          setAuth(false);
        }
      })
      .catch(err => console.log(err));
      setAuth(false);
  }, [location.pathname]);

  return <>
    <Navbar auth={auth} role={role}/>
    
    <div className={styles.outletWrapper}>
      <Outlet context={{ auth, setAuth, role }} />
    </div>

    <Footer/>
    
  </>
}
