import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./ChangePassword.module.css";
import { useNavigate } from "react-router-dom";

export default function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState(""); 
  const [isError, setIsError] = useState(false); 
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch user data (e.g., avatar, username) on page load
    const fetchUserData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/user/profile", {
          withCredentials: true,
        });
        setUser(response.data);
      } catch (error) {
        console.error("Failed to fetch user data", error);
      }
    };

    fetchUserData();
  }, []);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    
    setMessage(""); // Clear previous messages

    // Check if new passwords match
    if (newPassword !== confirmPassword) {
      setMessage("New passwords do not match");
      setIsError(true); // Set to error state
      return;
    }

    try {
      const response = await axios.put(
        "http://localhost:5000/user/change-password",
        {
          currentPassword,
          newPassword,
        },
        { withCredentials: true }
      );

      if (response.data.Status === "Password updated successfully") {
        setMessage("Password updated successfully");
        setIsError(false); // Success message
        setTimeout(() => {
          navigate("/profile");
        }, 2000);
      } else {
        setMessage(response.data.Error || "Something went wrong");
        setIsError(true); // Error message
      }
    } catch (error) {
      setMessage("Server error. Please try again later.");
      setIsError(true); // Error message
    }
  };

  const handleCurrentPasswordBlur = async () => {
    // Validate the current password when the user leaves the field
    if (currentPassword) {
      try {
        const response = await axios.post(
          "http://localhost:5000/user/validate-password",
          { currentPassword },
          { withCredentials: true }
        );
        if (response.data.Status === "Invalid password") {
          setMessage("Current password is incorrect");
          setIsError(true); // Error message
        }
      } catch (error) {
        setMessage("Server error. Please try again later.");
        setIsError(true); // Error message
      }
    }
  };

  return <>
    <div className={styles.container}>
      <div className={styles.formContainer}>
        {/* Display user avatar and username */}
        {user && (
          <div className={styles.profileHeader}>
            <div className={styles.avatar}>
              <span>👤</span> 
            </div>
            <h2>{user.name}</h2>
            <p>{user.phone}</p> 
          </div>
        )}

        <h2>Change Password</h2>
        <form onSubmit={handleChangePassword}>
          <div className={styles.inputGroup}>
            <label>Current Password:</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              onBlur={handleCurrentPasswordBlur} 
              required
              autoComplete="new-password"
            />
          </div>
          <div className={styles.inputGroup}>
            <label>New Password:</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label>Confirm New Password:</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <hr className={styles.solid}></hr>

          <div className={styles.buttonContainer}>
            <button type="submit" className={styles.saveButton}>
              Save
            </button>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={() => navigate("/profile")}
            >
              Cancel
            </button>
          </div>

          {/* Message display */}
          {message && (
            <p
              className={`${styles.message} ${isError ? styles.errorMessage : styles.successMessage}`}
            >
              {message}
            </p>
          )}
        </form>
      </div>
    </div>
    </>
};
