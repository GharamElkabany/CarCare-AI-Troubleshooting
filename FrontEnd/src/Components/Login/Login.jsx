import React from "react";
import styles from "./Login.module.css";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect } from "react";

export default function Login({ setAuth, setRole }) {
  let navigate = useNavigate();

  useEffect(() => {
    localStorage.clear();
    sessionStorage.clear();
  }, []);

  useEffect(() => {
    emailFormik.resetForm(); // Reset email form
    phoneFormik.resetForm(); // Reset phone form
  }, []);

  axios.defaults.withCredentials = true;

  function handleLogin(values) {
    axios
      .post("http://localhost:5000/login", values)
      .then((res) => {
        if (res.data.Status === "Success") {
          console.log(res.data.role);
          const token = res.data.token;
          const userRole = res.data.role;
          console.log(token);

          // Store token and role in localStorage
          localStorage.setItem("token", "true");
          localStorage.setItem("role", userRole);

          setAuth(true);
          setRole(userRole);
          navigate("/home");
        } else {
          alert(res.data.Error);
        }
      })
      .catch((err) => console.log(err));
  }

  let emailvalidationSchema = Yup.object({
    email: Yup.string().required("Email is required").email("Email is invalid"),
    password: Yup.string()
      .required("Password is required")
      .matches(
        /^[A-Z][a-z0-9]{5,10}$/,
        "Password must start with upercase ..."
      ),
  });

  let phoneValidationSchema = Yup.object({
    phone: Yup.string()
      .required("Phone number is required")
      .matches(
        /^(\+?6?01)[02-46-9]-*[0-9]{7}$|^(\+?6?01)[1]-*[0-9]{8}$/,
        "Phone must be a valid number"
      ),
    password: Yup.string()
      .required("Password is required")
      .matches(
        /^[A-Z][a-z0-9]{5,10}$/,
        "Password must start with an uppercase letter..."
      ),
  });

  let emailFormik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: emailvalidationSchema,
    onSubmit: handleLogin,
  });
  let phoneFormik = useFormik({
    initialValues: {
      phone: "",
      password: "",
    },
    validationSchema: phoneValidationSchema,
    onSubmit: handleLogin,
  });

  return (
    <>
      <div className={`${styles.container}`}>
        <div className={`${styles.section}`}>
          <div className={`${styles.container}`}>
            <div className="row full-height justify-content-center">
              <div className="col-12 text-center align-self-center py-5">
                <div
                  className={`${styles.section} pb-5 pt-5 pt-sm-2 text-center`}
                >
                  <h6 className="mb-0 pb-3">
                    <span></span>
                    <span>Email</span>
                    <span>Phone number</span>
                  </h6>
                  <input
                    className={`${styles.checkbox}`}
                    type="checkbox"
                    id="reg-log"
                    name="reg-log"
                  />
                  <label htmlFor="reg-log"></label>
                  <div className={`${styles.card3dwrap} mx-auto`}>
                    <div className={`${styles.card3dwrapper}`}>
                      {/* Front Card: Login with Email */}
                      <div className={`${styles.cardfront}`}>
                        <div className={`${styles.centerwrap}`}>
                          <div className={`${styles.section} text-center`}>
                            <h4 className="mb-4 pb-3">Login with Email</h4>
                            <form onSubmit={emailFormik.handleSubmit}>
                              <div className={`${styles.centerContent}`}>
                                <div className={`${styles.textInputWrapper}`}>
                                  <input
                                    type="text"
                                    style={{ display: "none" }}
                                    autoComplete="username"
                                  />
                                  <input
                                    type="password"
                                    style={{ display: "none" }}
                                    autoComplete="new-password"
                                  />
                                  <input
                                    type="text"
                                    name="email"
                                    className={`${styles.textInput}`}
                                    placeholder="Your Email"
                                    id="email"
                                    autoComplete="off"
                                    onBlur={emailFormik.handleBlur}
                                    onChange={emailFormik.handleChange}
                                    value={emailFormik.values.email}
                                  />
                                </div>
                                {emailFormik.touched.email &&
                                  emailFormik.errors.email && (
                                    <div
                                      className={`${styles.customAlert}`}
                                    >
                                      {emailFormik.errors.email}
                                    </div>
                                  )}

                                <div
                                  className={`${styles.textInputWrapper} mt-2`}
                                >
                                  <input
                                    type="password"
                                    name="password"
                                    className={`${styles.textInput}`}
                                    placeholder="Your Password"
                                    id="email-password"
                                    autoComplete="off"
                                    onBlur={emailFormik.handleBlur}
                                    onChange={emailFormik.handleChange}
                                    value={emailFormik.values.password}
                                  />
                                </div>
                                {emailFormik.touched.password &&
                                  emailFormik.errors.password && (
                                    <div
                                      className={`${styles.customAlert}`}
                                    >
                                      {emailFormik.errors.password}
                                    </div>
                                  )}

                                {/* Forget Password Link */}
                                <p className={styles.forgotPassword}>
                                  <Link to="/ForgetPassword">
                                    Forgot Password?
                                  </Link>
                                </p>
                              </div>

                              <button
                                type="submit"
                                className={`${styles.btn} mt-4`}
                                disabled={
                                  !emailFormik.isValid || !emailFormik.dirty
                                }
                              >
                                Login
                              </button>
                            </form>
                            <p className={`${styles.signup}`}>
                              Don't have an account?{" "}
                              <Link to="/Register">Sign Up</Link>
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Back Card: Login with Phone */}
                      <div className={`${styles.cardback}`}>
                        <div className={`${styles.centerwrap}`}>
                          <div className={`${styles.section} text-center`}>
                            <h4 className="mb-4 pb-3">Login with Phone</h4>
                            <form onSubmit={phoneFormik.handleSubmit}>
                              <div className={`${styles.centerContent}`}>
                                <div className={`${styles.textInputWrapper}`}>
                                  <input
                                    type="text"
                                    style={{ display: "none" }}
                                    autoComplete="username"
                                  />
                                  <input
                                    type="password"
                                    style={{ display: "none" }}
                                    autoComplete="new-password"
                                  />
                                  <input
                                    type="text"
                                    name="phone"
                                    className={`${styles.textInput}`}
                                    placeholder="Your Phone Number"
                                    id="phone"
                                    autoComplete="off"
                                    onBlur={phoneFormik.handleBlur}
                                    onChange={phoneFormik.handleChange}
                                    value={phoneFormik.values.phone}
                                  />
                                </div>
                                <i
                                  className={`${styles.inputicon} uil uil-phone`}
                                ></i>
                                {phoneFormik.touched.phone &&
                                  phoneFormik.errors.phone && (
                                    <div
                                      className={`${styles.customAlert}`}
                                    >
                                      {phoneFormik.errors.phone}
                                    </div>
                                  )}

                                <div
                                  className={`${styles.textInputWrapper}  mt-2`}
                                >
                                  <input
                                    type="password"
                                    name="password"
                                    className={`${styles.textInput}`}
                                    placeholder="Your Password"
                                    id="phone-password"
                                    autoComplete="off"
                                    onBlur={phoneFormik.handleBlur}
                                    onChange={phoneFormik.handleChange}
                                    value={phoneFormik.values.password}
                                  />
                                </div>
                                <i
                                  className={`${styles.inputicon} uil uil-lock-alt`}
                                ></i>
                                {phoneFormik.touched.password &&
                                  phoneFormik.errors.password && (
                                    <div
                                      className={`${styles.customAlert}`}
                                    >
                                      {phoneFormik.errors.password}
                                    </div>
                                  )}

                                {/* Forget Password Link */}
                                <p className={styles.forgotPassword}>
                                  <Link to="/ForgetPassword">
                                    Forgot Password?
                                  </Link>
                                </p>
                              </div>

                              <button
                                type="submit"
                                className={`${styles.btn} mt-4`}
                                disabled={
                                  !phoneFormik.isValid || !phoneFormik.dirty
                                }
                              >
                                Login
                              </button>
                            </form>
                            <p className={`${styles.signup}`}>
                              Don't have an account?{" "}
                              <Link to="/Register">Sign Up</Link>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
