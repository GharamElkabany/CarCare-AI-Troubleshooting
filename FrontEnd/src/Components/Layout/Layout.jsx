import React from 'react';
import styles from './Layout.module.css';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import { Outlet } from 'react-router-dom';

export default function Layout() {
  return <>
    <Navbar/>
    
    <div className="container">
      <Outlet/>
    </div>

    <Footer/>
    
  </>
}
