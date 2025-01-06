import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import axios from 'axios';
import styles from './RatingDistribution.module.css';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function RatingDistribution() {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);

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
                '#9966FF'
              ],
            },
          ],
        });
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching chart data:", error);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;

  return <>

    <div className={styles.container}>
      <h3>Ratings Distribution</h3>
      {chartData && <Pie data={chartData} />}
    </div>
    
  </>
}
