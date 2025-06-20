import React, { useEffect, useState } from "react";
import styles from "./Home.module.css";
import axios from "axios";
import { Link, useOutletContext } from "react-router-dom";
import About from "../About/About";
import Faq from "../Faq/Faq";
import Feedback from "../Feedback/Feedback";
import AdminDashboard from "../AdminDashboard/AdminDashboard";
import Support from "../Support/Support";

export default function Home() {
  const { role } = useOutletContext();
  const { setAuth } = useOutletContext();
  const [auth, setLocalAuth] = useState(false);
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");

  axios.defaults.withCredentials = true;

  useEffect(() => {
    axios
      .get("http://localhost:5000")
      .then((res) => {
        if (res.data.Status === "Success") {
          setLocalAuth(true);
          setName(res.data.name);
          setAuth(true);
        } else {
          setLocalAuth(false);
          setMessage(res.data.Error);
          setAuth(false);
        }
      })
      .then((err) => console.log(err));
  }, [setAuth]);

  return (
    <>
      {role === "user" && (
        <div id="home" className={styles.homeContainer} style={{ paddingTop: '55px', marginTop: '-55px' }}>
          <div className={styles.heroSection}>
            <h1 className={styles.heroTitle}>Empower Your Car Maintenance</h1>
            <p className={styles.heroSubtitle}>
              Diagnose and Fix Car <b>Dashboard</b> Issues with Ease
            </p>
            <Link to="/diagnostics">
              <button className={styles.heroButton}>
                Chat with our AI Diagnostic Now
              </button>
            </Link>
          </div>
        </div>
      )}

      <div id="adminDashnoard" style={{ paddingTop: '70px', marginTop: '-70px' }}>
        <div>
          {role === "admin" && (
            <AdminDashboard />          
          )}
        </div>
      </div>

      <div id="about">
        <About />
      </div>

      <div id="faq">
        {role === "user" && (
          <Faq />          
        )}
      </div>

      <div id="feedback">
        {role === "user" && (
            <Feedback />          
        )}
      </div>

      <div id="support">
        {role === "user" && (
          <Support />          
        )}
      </div>
    </>
  );
}
