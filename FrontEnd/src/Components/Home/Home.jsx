import React, { useEffect, useState } from 'react';
import styles from './Home.module.css';
import axios from 'axios';
import { Link } from 'react-router-dom';


export default function Home() {
  const [auth, setAuth] = useState(false);
  const [message, setMessage] = useState('');
  const [name, setName] = useState('');

  axios.defaults.withCredentials = true;
  useEffect(()=> {
    axios.get('http://localhost:5000')
    .then(res => {
      if (res.data.Status === 'Success'){
        setAuth(true);
        setName(res.data.name);
      } else {
        setAuth(false);
        setMessage(res.data.Error);
      }
    })
    .then(err => console.log(err));
  }, [])

  return <>

    <div className='container mt-4'>
      {
        auth ?
        <div>
          <h3>You are authorized --- {name}</h3>
          <button className='btn btn-danger'>Logout</button>
        </div>
        :
        <div>
          <h3>{message}</h3>
          <h3>Login Now</h3>
          <Link to="/login" className='btn btn-primary'>Login</Link>
        </div>
      }

    </div>
    
  </>
}
