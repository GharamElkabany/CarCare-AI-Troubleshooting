import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2'; // Use Pie instead of Doughnut
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import axios from 'axios';
import styles from './FeedbackVsRegistration.module.css';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function FeedbackVsRegistration() {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5000/stats/feedback-vs-registration')
      .then((response) => {
        if (response.data.Error) {
          console.error(response.data.Error);
          return;
        }
        const totalFeedbackCount = response.data.reduce((sum, item) => sum + item.feedback_count, 0);
        const totalRegistrationCount = response.data.reduce((sum, item) => sum + item.registration_count, 0);

        setChartData({
          labels: ['Feedbacks', 'Registrations'],
          datasets: [
            {
              label: 'Feedback vs Registration',
              data: [totalFeedbackCount, totalRegistrationCount],
              backgroundColor: ['#FF6384', '#36A2EB'],
              hoverOffset: 4,
            },
          ],
        });
      })
      .catch((error) => console.error(error));
  }, []);

  if (!chartData) return <div>Loading...</div>;

  return (
    <div className={`${styles.chartContainer}`}>
      <h2>Feedback vs Registration</h2>
      <Pie
        data={chartData}
        options={{
          responsive: true,
          plugins: {
            legend: { position: 'top' },
          },
        }}
      />
    </div>
  );
}
