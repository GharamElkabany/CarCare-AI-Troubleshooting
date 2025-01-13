import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import styles from './VerifyEmail.module.css';

export default function VerifyEmail() {
    const [message, setMessage] = useState("");
    const [status, setStatus] = useState("");
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const token = queryParams.get("token");

        axios.get(`http://localhost:5000/verify-email?token=${token}`)
            .then(res => {
                if (res.data.Status === "Success") {
                    setMessage("Email verified successfully! Redirecting to login...");
                    setStatus("success");
                    setTimeout(() => navigate("/login"), 3000);
                } else {
                    setMessage(res.data.Error || "Invalid token");
                    setStatus("error");
                }
            })
            .catch(() => {
                setMessage("Verification failed. Please try again later.");
                setStatus("error");
            });
    }, [location.search, navigate]);

    return <>
        <div className={styles.container}>
            <div className={`${styles.card} ${status === "success" ? styles.successCard : styles.errorCard}`}>
                <div className={styles.icon}>
                    {status === "success" ? "🎉" : "⚠️"}
                </div>
                <h1>{status === "success" ? "Congratulations!" : "Oops!"}</h1>
                <p>{message}</p>
            </div>
        </div>
    </>
}
