import React, { useEffect, useState } from 'react';
import styles from './Home.module.css';
import axios from 'axios';
import { Link, useOutletContext } from 'react-router-dom';

export default function Home() {
  const {setAuth} = useOutletContext();
  const [auth, setLocalAuth] = useState(false);
  const [message, setMessage] = useState('');
  const [name, setName] = useState('');

  axios.defaults.withCredentials = true;

  useEffect(()=> {
    axios.get('http://localhost:5000')
    .then(res => {
      if (res.data.Status === 'Success'){
        setLocalAuth(true);
        setName(res.data.name);
        setAuth(true);
      } else {
        setLocalAuth(false);
        setMessage(res.data.Error);
        setAuth(false);
      }
    })
    .then(err => console.log(err));
  }, [setAuth])

  const handleLogout = () => {
    axios.get('http://localhost:5000/logout')
    .then(res => {
      setLocalAuth(false);
      setAuth(false);
    })
    .catch (err => console.log(err));
  }

  return <>

    <div className='container mt-4'>
      {
        auth ?
        <div>
          <h3>You are authorized --- {name}</h3>
        </div>
        :
        <div>
          <h3>{message}</h3>
          <h3>Login Now</h3>
        </div>
      }

    </div>
    
  </>
}
