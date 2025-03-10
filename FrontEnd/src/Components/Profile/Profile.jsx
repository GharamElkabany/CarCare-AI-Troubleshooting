import React, { useState, useEffect } from "react";
import styles from "./Profile.module.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Profile( { setAuth, setRole } ) {
  const [editing, setEditing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
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
    // Scroll to the top when the component is mounted
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    const storedUserData = localStorage.getItem("userData");
  if (storedUserData) {
    setUserData(JSON.parse(storedUserData)); // Load data from localStorage
    setUpdatedData(JSON.parse(storedUserData));
  } else {
      // If no data in localStorage, fetch from the server
      axios
        .get("http://localhost:5000/user/profile", { withCredentials: true })
        .then((res) => {
          if (res.data.Error) {
            setErrorMessage(res.data.Error);
          } else {
            setUserData(res.data);
            setUpdatedData(res.data);
            localStorage.setItem("userData", JSON.stringify(res.data)); // Save data to localStorage
          }
        })
        .catch(() => setErrorMessage("Failed to load user data"));
    }
  }, []);

  const handleInputChange = (e) => {
    setUpdatedData({ ...updatedData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    if (
      updatedData.name === userData.name &&
      updatedData.phone === userData.phone
    ) {
      setErrorMessage("No changes made.");
      return;
    }

    const dataToUpdate = { ...updatedData, email: userData.email };
    
    axios
      .put("http://localhost:5000/user/profile", dataToUpdate, {
        withCredentials: true,
      })
      .then((res) => {
        if (res.data.Error) {
          setErrorMessage(res.data.Error);
        } else {
          setSuccessMessage("Profile updated successfully!");
          setUserData(dataToUpdate); // Update local state
          localStorage.setItem("userData", JSON.stringify(dataToUpdate));
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
          setRole("");
          localStorage.removeItem("userData");
          navigate("/"); // Redirect to welcome after logout
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
                  onClick={() => {
                    setUpdatedData(userData);
                    setEditing(true);
                  }}
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
