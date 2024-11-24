import React from 'react';
import styles from './Feedback.module.css';
import { useState } from 'react';

export default function Feedback() {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [feedback, setFeedback] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Feedback Submitted: \nRating: ${rating} Stars\nComment: ${feedback}`);
    // Reset feedback form
    setRating(0);
    setFeedback("");
  };

  return <>

<div className={styles.feedbackContainer}>
      <h2 className={styles.title}>Share your Feedback</h2>
      <div className={styles.feedbackBox}>
        <form onSubmit={handleSubmit}>
          {/* Rating Section */}
          <div className={styles.ratingContainer}>
            <p className={styles.question}>How can you rate your experience with CarCare?</p>
            <div className={styles.stars}>
              {[...Array(5)].map((_, index) => {
                const starValue = index + 1;
                return (
                  <span
                    key={starValue}
                    className={styles.star}
                    onClick={() => setRating(starValue)}
                    onMouseEnter={() => setHover(starValue)}
                    onMouseLeave={() => setHover(0)}
                    style={{ color: starValue <= (hover || rating) ? "#ffd700" : "#ccc" }}
                  >
                    ★
                  </span>
                );
              })}
            </div>
          </div>

          {/* Feedback Section */}
          <div className={styles.textAreaContainer}>
            <textarea
              className={styles.textArea}
              placeholder="Please share your experience here ..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
            />
          </div>

          <button type="submit" className={styles.submitButton}>
            Share Feedback
          </button>
        </form>
      </div>
    </div>
    
  </>
}
