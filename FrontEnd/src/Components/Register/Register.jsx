import React, { useState } from 'react';
import styles from './Register.module.css';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


export default function Register() {
  let navigate = useNavigate();
  const [isloading, setisloading] = useState(false);

  function handleRegister(values)
  {
    setisloading(true);
    axios.post('http://localhost:5000/register',values)
    .then(res => {
      if (res.data.Status === 'Success'){
        setisloading(false);
        navigate('/login');
      } else {
        alert(res.data.Error);
        setisloading(true);
      }
    })
    .then(err => console.log(err));

  }

  let validationSchema = Yup.object({
    name : Yup.string().required('Name is required').min(3 , 'Name minlength is 3').max(10 , 'Name maxlength is 10'),
    email : Yup.string().required('Email is required').email('Email is invalid'),
    phone : Yup.string().required('Phone is required').matches(/^(\+?6?01)[02-46-9]-*[0-9]{7}$|^(\+?6?01)[1]-*[0-9]{8}$/gm , 'Phone must be valid phone number'),
    password : Yup.string().required('Password is required').matches(/^[A-Z][a-z0-9]{5,10}$/ , 'Password must start with upercase ...'),
    repassword : Yup.string().required('Confirm Password is required').oneOf([Yup.ref('password')] , 'Password and Confirm Password doesnt match'),
  })

  let formik = useFormik({
    initialValues:{
      name:'',
      email:'',
      phone:'',
      password:'',
      repassword:''
    },
    validationSchema,
    onSubmit:handleRegister
  })

  return <>
    <div className='w-75 mx-auto py-4'>
      <h3 className='mb-4'>Register Now</h3>

      <form onSubmit={formik.handleSubmit}>

        {/* <div className="form-floating mb-3">
          <input onChange={formik.handleChange} value={formik.values.name} onBlur={formik.handleBlur} type='text' name='name' id='name' className='form-control' placeholder="name"></input>
          <label htmlFor="name">Username</label>
        </div> */}
        
        <label htmlFor="name">Name :</label>
        <input onBlur={formik.handleBlur} className='form-control mb-2' onChange={formik.handleChange} value={formik.values.name} type='text' name='name' id='name'/>
        {formik.errors.name && formik.touched.name ? <div className='alert alert-danger'>{formik.errors.name}</div> : null }

        <label htmlFor="email">Email :</label>
        <input onBlur={formik.handleBlur} className='form-control mb-2' onChange={formik.handleChange} value={formik.values.email} type='text' name='email' id='email'/>
        {formik.errors.email && formik.touched.email ? <div className='alert alert-danger'>{formik.errors.email}</div> : null }

        <label htmlFor="phone">Phone Number :</label>
        <input onBlur={formik.handleBlur} className='form-control mb-2' onChange={formik.handleChange} value={formik.values.phone} type='text' name='phone' id='phone'/>
        {formik.errors.phone && formik.touched.phone ? <div className='alert alert-danger'>{formik.errors.phone}</div> : null }    

        <label htmlFor="password">Password :</label>
        <input onBlur={formik.handleBlur} className='form-control mb-2' onChange={formik.handleChange} value={formik.values.password} type="password" name='password' id='password'/>
        {formik.errors.password && formik.touched.password ? <div className="alert alert-danger">{formik.errors.password}</div> : null }

        <label htmlFor="repassword">Confirm Password :</label>
        <input onBlur={formik.handleBlur} className='form-control mb-2' onChange={formik.handleChange} value={formik.values.repassword} type="password" name='repassword' id='repassword'/>
        {formik.errors.repassword && formik.touched.repassword ? <div className="alert alert-danger">{formik.errors.repassword}</div> : null }

        {isloading ? <button type='button' className='btn bg-main text-white'><i className='fas fa-spinner fa-spin'></i></button> : 
          <button disabled = {! (formik.isValid && formik.dirty)} type='submit' className='btn bg-main text-white'>Register</button>
          }
                                      

      </form>

    </div>
    
  </>
}
