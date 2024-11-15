import React, { useState , useEffect } from 'react';
import styles from './Layout.module.css';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import { Outlet } from 'react-router-dom';
import axios from 'axios';

export default function Layout() {
  const [auth, setAuth] = useState(false);

  useEffect(() => {
    axios.get('http://localhost:5000')
      .then(res => {
        if (res.data.Status === 'Success') {
          setAuth(true);
        } else {
          setAuth(false);
        }
      })
      .catch(err => console.log(err));
  }, []);

  const handleLogout = () => {
    axios.get('http://localhost:5000/logout')
      .then(res => {
        setAuth(false);  // Update auth state in Layout
      })
      .catch(err => console.log(err));
  };

  return <>
    <Navbar auth={auth} handleLogout={handleLogout}/>
    
    <div className="container">
      <Outlet context={{ setAuth }}/>
    </div>

    <Footer/>
    
  </>
}
