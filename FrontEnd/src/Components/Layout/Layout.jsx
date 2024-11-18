import React, { useState , useEffect } from 'react';
import styles from './Layout.module.css';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import { Outlet, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Layout() {
  const [auth, setAuth] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:5000')
      .then(res => {
        if (res.data.Status === 'Success') {
          setAuth(true);
        } else {
          setAuth(false);
          navigate('/');
        }
      })
      .catch(err => console.log(err));
  }, [navigate]);

  const handleLogout = () => {
    axios.get('http://localhost:5000/logout')
      .then(res => {
        setAuth(false);  // Update auth state in Layout
        navigate('/');
      })
      .catch(err => console.log(err));
  };

  return <>
    <Navbar auth={auth} handleLogout={handleLogout}/>
    
    <div className={styles.outletWrapper}>
      <Outlet context={{ setAuth }}/>
    </div>

    <Footer/>
    
  </>
}
