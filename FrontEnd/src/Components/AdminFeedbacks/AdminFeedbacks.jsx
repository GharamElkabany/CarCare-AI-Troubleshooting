import React, { useEffect, useState } from "react";
import styles from "./AdminFeedbacks.module.css";
import axios from "axios";

export default function AdminFeedbacks() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [feedbacksPerPage] = useState(3);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRating, setSelectedRating] = useState(0);

  useEffect(() => {
    axios
    .get("http://localhost:5000/feedbacks", { withCredentials: true })
      .then((res) => {
        if (res.data.Error) {
          alert(res.data.Error);
        } else {
          setFeedbacks(res.data);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  const filteredFeedbacks = feedbacks.filter((feedback) => {
    const matchesName = feedback.name
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesRating =
      selectedRating === 0 || feedback.rating === selectedRating;
    return matchesName && matchesRating;
  });

  const indexOfLastFeedback = currentPage * feedbacksPerPage;
  const indexOfFirstFeedback = indexOfLastFeedback - feedbacksPerPage;
  const currentFeedbacks = filteredFeedbacks.slice(
    indexOfFirstFeedback,
    indexOfLastFeedback
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <>
      <div className={styles.FeedbacksPage}>
      <div className={styles.feedbackContainer}>
        <h2 className={styles.title}>Users Feedback</h2>

        {/* Search and Filter Section */}
        <div className={styles.filterContainer}>
          <input
            type="text"
            placeholder="Search feedback by user name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
          <div className={styles.starFilter}>
            {[...Array(5)].map((_, index) => {
              const starValue = index + 1;
              return (
                <span
                  key={starValue}
                  className={styles.star}
                  onClick={() =>
                    setSelectedRating(selectedRating === starValue ? 0 : starValue)
                  }
                  style={{
                    color: starValue <= selectedRating ? "#ffd700" : "#ccc",
                    cursor: "pointer",
                  }}
                >
                  ★
                </span>
              );
            })}
          </div>
        </div>

        {/* Feedback List */}
        {currentFeedbacks.length > 0 ? (
          currentFeedbacks.map((feedback) => (
            <div key={feedback.id} className={styles.feedbackCard}>
              <h4>{feedback.name}</h4>
              <div className={styles.ratingDisplay}>
                {[...Array(5)].map((_, index) => {
                  const starValue = index + 1;
                  return (
                    <span
                      key={starValue}
                      className={styles.star}
                      style={{
                        color: starValue <= feedback.rating ? "#ffd700" : "#ccc",
                      }}
                    >
                      ★
                    </span>
                  );
                })}
              </div>
              <p>{feedback.feedback}</p>
              <span>{new Date(feedback.timestamp).toLocaleString()}</span>
            </div>
          ))
        ) : (
          <p>No feedback available</p>
        )}

        {/* Pagination */}
        {filteredFeedbacks.length > feedbacksPerPage && (
          <div className={styles.pagination}>
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className={styles.paginationButton}
            >
              Back
            </button>
            <span>Page {currentPage}</span>
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={indexOfLastFeedback >= filteredFeedbacks.length}
              className={styles.paginationButton}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
    </>
  );
}
