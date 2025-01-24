import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import axios from 'axios';
import styles from './RatingDistribution.module.css';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function RatingDistribution() {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5000/feedback/ratings')
      .then((response) => {
        const data = response.data;
        const labels = data.map(item => `Rating ${item.rating}`);
        const values = data.map(item => item.count);

        setChartData({
          labels: labels,
          datasets: [
            {
              label: 'Ratings Distribution',
              data: values,
              backgroundColor: [
                '#FF6384',
                '#36A2EB',
                '#FFCE56',
                '#4CAF50',
                '#9966FF',
              ],
            },
          ],
        });
      })
      .catch((error) => console.error("Error fetching chart data:", error));
  }, []);

  if (!chartData) return <div>Loading...</div>;

  return (
    <div className={`${styles.chartContainer}`}>
      <h2>Ratings Distribution</h2>
      <Bar
        data={chartData}
        options={{
          responsive: true,
          plugins: {
            legend: {
              display: false,
            },
            tooltip: {
              callbacks: {
                label: (tooltipItem) => {
                  const value = tooltipItem.raw;
                  return ` ${value} ratings`;
                },
              },
            },
          },
        }}
      />
    </div>
  );
}
