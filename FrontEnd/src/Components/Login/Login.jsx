import React, { useState } from 'react';
import styles from './Login.module.css';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


export default function Login() {
  let navigate = useNavigate();
  const [isloading, setisloading] = useState(false);

  function handleLogin(values)
  {
    setisloading(true);
    axios.post('http://localhost:5000/login',values)
    .then(res => {
      if (res.data.Status === 'Success'){
        setisloading(false);
        navigate('/');
      } else {
        alert(res.data.Error);
        setisloading(false);
      }
    })
    .then(err => console.log(err));

  }

  let validationSchema = Yup.object({
    email : Yup.string().required('Email is required').email('Email is invalid'),
    password : Yup.string().required('Password is required').matches(/^[A-Z][a-z0-9]{5,10}$/ , 'Password must start with upercase ...'),
  })

  let formik = useFormik({
    initialValues:{
      email:'',
      password:'',
    },
    validationSchema,
    onSubmit:handleLogin
  })

  return <>
    <div className='w-75 mx-auto py-4'>
      <h3 className='mb-4'>Login Now</h3>

      <form onSubmit={formik.handleSubmit}>
        
        <label htmlFor="email">Email :</label>
        <input onBlur={formik.handleBlur} className='form-control mb-2' onChange={formik.handleChange} value={formik.values.email} type='text' name='email' id='email'/>
        {formik.errors.email && formik.touched.email ? <div className='alert alert-danger'>{formik.errors.email}</div> : null }

        <label htmlFor="password">Password :</label>
        <input onBlur={formik.handleBlur} className='form-control mb-2' onChange={formik.handleChange} value={formik.values.password} type="password" name='password' id='password'/>
        {formik.errors.password && formik.touched.password ? <div className="alert alert-danger">{formik.errors.password}</div> : null }

        
        {isloading ? <button type='button' className='btn bg-main text-white'><i className='fas fa-spinner fa-spin'></i></button> : 
          <button disabled = {! (formik.isValid && formik.dirty)} type='submit' className='btn bg-main text-white'>Login</button>
          }
                                      

      </form>

    </div>
    
  </>
}
