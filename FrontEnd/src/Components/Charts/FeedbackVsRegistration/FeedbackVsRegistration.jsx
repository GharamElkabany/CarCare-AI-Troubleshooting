import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import axios from 'axios';
import styles from './FeedbackVsRegistration.module.css';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function FeedbackVsRegistration() {
  const [chartData, setChartData] = useState(null);

    useEffect(() => {
        axios.get('http://localhost:5000/stats/feedback-vs-registration')
            .then(response => {
                if (response.data.Error) {
                    console.error(response.data.Error);
                    return;
                }
                const labels = response.data.map(item => item.month);
                const feedbackData = response.data.map(item => item.feedback_count);
                const registrationData = response.data.map(item => item.registration_count);

                setChartData({
                    labels,
                    datasets: [
                        {
                            label: 'Feedback Count',
                            data: feedbackData,
                            backgroundColor: 'rgb(62, 205, 205)',
                        },
                        {
                            label: 'Registration Count',
                            data: registrationData,
                            backgroundColor: 'rgba(153, 102, 255, 0.84)',
                        },
                    ],
                });
            })
            .catch(error => console.error(error));
    }, []);

    if (!chartData) return <div>Loading...</div>;

  return <>

    <div className={styles.chartContainer}>
            <h2>Feedback vs Registration</h2>
            <Bar
                data={chartData}
                width={600}
                height={400}
                options={{
                    responsive: true,
                    plugins: {
                        legend: { position: 'top' },
                    },
                }}
            />
        </div>
    
  </>
}
