import React from 'react';
import styles from './AdminDashboard.module.css';
import RatingDistribution from "../Charts/RatingDistribution/RatingDistribution";
import FeedbackVsRegistration from "../Charts/FeedbackVsRegistration/FeedbackVsRegistration";

export default function AdminDashboard() {
  return <>
    <div className={styles.dashboardContainer}>
      <h1 className={styles.title}>Admin Dashboard</h1>
      <div className={styles.grid}>
        <div className={styles.card}>
          <RatingDistribution />
        </div>
        <div className={styles.card}>
          <FeedbackVsRegistration />
        </div>
      </div>
    </div>
    
  </>
}
