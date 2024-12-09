import React from 'react';
import svg from "../../assets/images/404.svg";
import styles from './NotFound.module.css';
import { useNavigate } from 'react-router-dom';

export default function NotFound() {
  const navigate = useNavigate();

  return <>

    <div className={styles['cont-404']}>
      <img src={svg} alt="404 - Page Not Found" />
      <button onClick={() => navigate('/')}>Back to Home</button>
    </div>
    
  </>
}
