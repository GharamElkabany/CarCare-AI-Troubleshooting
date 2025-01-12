import React, { useState } from "react";
import styles from "./Register.module.css";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  let navigate = useNavigate();

  function handleRegister(values) {
    axios
      .post("http://localhost:5000/register", values)
      .then((res) => {
        if (res.data.Status === "Success") {
          navigate("/login");
        } else {
          alert(res.data.Error);
        }
      })
      .then((err) => console.log(err));
  }

  let validationSchema = Yup.object({
    name: Yup.string()
      .required("Name is required")
      .min(3, "Name minimum length is 3")
      .max(10, "Name maximum length is 10"),
    email: Yup.string().required("Email is required").email("Email is invalid"),
    phone: Yup.string()
      .required("Phone is required")
      .matches(
        /^(\+?6?01)[02-46-9]-*[0-9]{7}$|^(\+?6?01)[1]-*[0-9]{8}$/gm,
        "Phone must be valid phone number"
      ),
    password: Yup.string()
      .required("Password is required")
      .matches(
        /^[A-Z][a-z0-9]{5,10}$/,
        "Password must start with upercase"
      ),
    repassword: Yup.string()
      .required("Confirm Password is required")
      .oneOf(
        [Yup.ref("password")],
        "Password and Confirm Password doesnt match"
      ),
  });

  let formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      repassword: "",
    },
    validationSchema,
    onSubmit: handleRegister,
  });

  return (
    <>
      <div className={`${styles.container}`}>
        <div className={`${styles.formcontainer}`}>
          <h2>Register Now</h2>

          <p>Please fill in your details to sign up</p>

          <form onSubmit={formik.handleSubmit}>
            <div className={`${styles.textInputWrapper}`}>
              <input
                onBlur={formik.handleBlur}
                className={`${styles.textInput}`}
                onChange={formik.handleChange}
                value={formik.values.name}
                type="text"
                placeholder="Name"
                name="name"
                id="name"
              />
            </div>
            {formik.errors.name && formik.touched.name ? (
                <div className={`${styles.alert}`}>{formik.errors.name}</div>
              ) : null}

            <div className={`${styles.textInputWrapper}`}>
              <input
                onBlur={formik.handleBlur}
                className={`${styles.textInput}`}
                onChange={formik.handleChange}
                value={formik.values.email}
                type="email"
                placeholder="Email"
                name="email"
                id="email"
              />
            </div>
            {formik.errors.email && formik.touched.email ? (
              <div className={`${styles.alert}`}>{formik.errors.email}</div>
            ) : null}

            <div className={`${styles.textInputWrapper}`}>
              <input
                onBlur={formik.handleBlur}
                className={`${styles.textInput}`}
                onChange={formik.handleChange}
                value={formik.values.phone}
                type="text"
                placeholder="Phone number"
                name="phone"
                id="phone"
              />
            </div>
            <span>
              {formik.errors.phone && formik.touched.phone ? (
                <div className={`${styles.alert}`}>{formik.errors.phone}</div>
              ) : null}
            </span>
            

            <div className={`${styles.textInputWrapper}`}>
              <div className={styles.inputWithTooltip}>
                <input
                  onBlur={formik.handleBlur}
                  className={`${styles.textInput}`}
                  onChange={formik.handleChange}
                  value={formik.values.password}
                  type="password"
                  placeholder="Password"
                  name="password"
                  id="password"
                />
                <span className={styles.tooltip}>
                  ℹ
                  <span className={styles.tooltipText}>
                    Password must start with an uppercase letter and be 6-11 characters
                    long.
                  </span>
                </span>
              </div>  
            </div>
            {formik.errors.password && formik.touched.password ? (
              <div className={`${styles.alert}`}>{formik.errors.password}</div>
            ) : null}

            <div className={`${styles.textInputWrapper}`}>
              <input
                onBlur={formik.handleBlur}
                className={`${styles.textInput}`}
                onChange={formik.handleChange}
                value={formik.values.repassword}
                type="password"
                placeholder="Confirm Password"
                name="repassword"
                id="repassword"
              />
            </div>
            {formik.errors.repassword && formik.touched.repassword ? (
              <div className={`${styles.alert}`}>{formik.errors.repassword}</div>
            ) : null}

            <button disabled={!(formik.isValid && formik.dirty)} type="submit">Register</button>
          </form>

          <p className={`${styles.signin}`}>
            Already have an account? <Link to="/login">Sign In</Link>
          </p>
        </div>
      </div>
    </>
  );
}
