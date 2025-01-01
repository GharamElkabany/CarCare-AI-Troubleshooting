import React, { useEffect, useState } from "react";
import styles from "./AdminFeedbacks.module.css";
import axios from "axios";

export default function AdminFeedbacks() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [feedbacksPerPage] = useState(3);
  const [searchTerm, setSearchTerm] = useState("");

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

  const filteredFeedbacks = feedbacks.filter((feedback) =>
    feedback.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <h2>Users Feedback</h2>

          {/* Search Bar */}
          <div className={styles.searchBar}>
            <input 
              type="text" 
              placeholder="Search feedback by user name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              />
            <button onClick={() => setCurrentPage(1)}>Search</button>
          </div>

          {currentFeedbacks.length > 0 ? (
            currentFeedbacks.map((feedback) => (
              <div key={feedback.id} className={styles.feedbackCard}>
                <h4>{feedback.name}</h4>
                <p>Rating: {feedback.rating} Stars</p>
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
