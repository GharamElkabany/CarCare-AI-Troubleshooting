import React, { useState, useEffect } from "react";
import styles from "./Profile.module.css";
import axios from "axios";
import { useNavigate, useOutletContext } from "react-router-dom";

export default function Profile() {
  const [editing, setEditing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const { setAuth } = useOutletContext();
  const navigate = useNavigate();

  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [updatedData, setUpdatedData] = useState({
    name: "",
    phone: "",
  });

  useEffect(() => {
    // Fetch user profile data
    axios
      .get("http://localhost:5000/user/profile", { withCredentials: true })
      .then((res) => {
        if (res.data.Error) {
          setErrorMessage(res.data.Error);
        } else {
          setUserData(res.data);
          setUpdatedData(res.data);
        }
      })
      .catch(() => setErrorMessage("Failed to load user data"));
  }, []);

  const handleInputChange = (e) => {
    setUpdatedData({ ...updatedData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    axios
      .put("http://localhost:5000/user/profile", updatedData, {
        withCredentials: true,
      })
      .then((res) => {
        if (res.data.Error) {
          setErrorMessage(res.data.Error);
        } else {
          setSuccessMessage("Profile updated successfully!");
          setUserData(updatedData); // Update local state
          setEditing(false);
        }
      })
      .catch(() => setErrorMessage("Failed to update user data"));
  };

  const handleLogout = () => {
    axios
      .get("http://localhost:5000/logout")
      .then((res) => {
        if (res.data.Status === "Success") {
          setAuth(false);
          navigate("/"); // Redirect to home after logout
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      <div className={styles.profilePage}>
        <div className={styles.profileContainer}>
          <div className={styles.profileHeader}>
            <div className={styles.avatar}>
              <span>👤</span>{" "}
              {/* Replace this emoji with an actual avatar/image */}
            </div>
            <h2>{userData.name}</h2>
            <p>{userData.phone}</p>
          </div>

          <div className={styles.profileForm}>
            {errorMessage && (
              <p className={styles.errorMessage}>{errorMessage}</p>
            )}
            {successMessage && (
              <p className={styles.successMessage}>{successMessage}</p>
            )}

            <label>Name :</label>
            <input
              type="text"
              name="name"
              value={editing ? updatedData.name : userData.name}
              onChange={handleInputChange}
              disabled={!editing}
            />

            <label>Email :</label>
            <input type="email" name="email" value={userData.email} disabled />

            <label>Phone :</label>
            <input
              type="text"
              name="phone"
              value={editing ? updatedData.phone : userData.phone}
              onChange={handleInputChange}
              disabled={!editing}
            />

            <p
              className={styles.changePasswordLink}
              onClick={() => navigate("/changePassword")}
            >
              Change Password
            </p>

            <hr className={styles.solid}></hr>

            <div className={styles.buttonContainer}>
              {editing ? (
                <>
                  <button className={styles.saveButton} onClick={handleSave}>
                    Save
                  </button>
                  <button
                    className={styles.cancelButton}
                    onClick={() => setEditing(false)}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  className={styles.editButton}
                  onClick={() => setEditing(true)}
                >
                  Edit Profile
                </button>
              )}
            </div>
          </div>

          <button className={styles.logoutButton} onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </>
  );
}
