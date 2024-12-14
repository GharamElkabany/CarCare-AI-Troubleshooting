import React, { useState , useEffect } from 'react';
import styles from './Layout.module.css';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import { Outlet, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Layout({ role }) {
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
      setAuth(false);
      navigate('/');
  }, [navigate]);

  return <>
    <Navbar auth={auth} role={role}/>
    
    <div className={styles.outletWrapper}>
      <Outlet context={{ auth, setAuth }} />
    </div>

    <Footer/>
    
  </>
}
