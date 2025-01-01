import React, { useState, useEffect } from "react";
import styles from "./About.module.css";
import axios from "axios";
import { useOutletContext } from 'react-router-dom';

export default function About() {
  const { role } = useOutletContext();
  const [isEditingPage, setIsEditingPage] = useState(false)
  const [aboutText, setAboutText] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/about")
      .then((res) => {
        if (res.data.Status === "Success") {
          setAboutText(res.data.aboutText);
        }else {
          console.error(res.data.Error);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  const handleTextChange = (e, id) => {
    setAboutText(
      aboutText.map((item) =>
        item.id === id ? { ...item, text: e.target.value } : item
      )
    );
  };

  const handleSave = (id, text) => {
    axios
      .put("http://localhost:5000/about", { id, text })
      .then((res) => {
        if (res.data.Status === "Success") {
          alert("Changes saved successfully!");
        } else {
          console.error(res.data.Error);
        }
      })
      .catch((err) => console.log(err));
  };


  return (
    <>
      <div className={styles.aboutContainer}>
      <div className={styles.contentWrapper}>
        {/* Left Section: Image */}
        <div className={styles.imageContainer}>
          {role === "admin" && (
            <button
              className={styles.toggleEditButton}
              onClick={() => setIsEditingPage(!isEditingPage)}
            >
              {isEditingPage ? "Done Editing" : "Edit About Page"}
            </button>
          )}
        </div>

        {/* Right Section: Text */}
        <div className={styles.textContainer}>
          <h2 className={styles.title}>About Us</h2>

          {aboutText.map((item) => (
            <div key={item.id} className={styles.paragraphContainer}>
              {isEditingPage ? (
                <textarea
                  className={styles.textarea}
                  value={item.text}
                  onChange={(e) => handleTextChange(e, item.id)}
                />
              ) : (
                <p className={styles.paragraph}>{item.text}</p>
              )}
              {isEditingPage && role === "admin" && (
                <button
                  className={styles.editButton}
                  onClick={() => handleSave(item.id, item.text)}
                >
                  Save
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
    </>
  );
}
