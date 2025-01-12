import React, { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import axios from 'axios';
import styles from './RatingDistribution.module.css';

ChartJS.register(ArcElement, Tooltip, Legend );

export default function RatingDistribution() {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [totalRatings, setTotalRatings] = useState(0);

  const centerTextPlugin = {
    id: 'centerText',
    beforeDraw: (chart) => {
      const { width } = chart;
      const { ctx } = chart;
      const total = chart.options.plugins.centerText.text;
      const lines = total.split('\n');

      const baseFontSize = Math.min(width / 15, 16); // Smaller font for smaller charts
      const lineHeight = baseFontSize + 5;

      const centerY = chart.chartArea.top + (chart.chartArea.bottom - chart.chartArea.top) / 2;

      ctx.save();
      ctx.font = `${baseFontSize}px Arial`;
      ctx.fillStyle = '#000';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      lines.forEach((line, index) => {
        ctx.fillText(line, width / 2, centerY + (index - (lines.length - 1) / 2) * lineHeight);
      });
      ctx.restore();
    },
  };

  useEffect(() => {
    axios.get('http://localhost:5000/feedback/ratings')
      .then((response) => {
        const data = response.data;
        const labels = data.map(item => `Rating ${item.rating}`);
        const values = data.map(item => item.count);
        const total = values.reduce((acc, value) => acc + value, 0);

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
              hoverOffset: 4,
            },
          ],
        });
        setTotalRatings(total);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching chart data:", error);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className={`${styles.chartContainer}`}>
      <h2>Ratings Distribution</h2>
      {chartData && (
        <Doughnut
          data={chartData}
          options={{
            responsive: true,
            aspectRatio: 1,
            plugins: {
              tooltip: {
                callbacks: {
                  label: (tooltipItem) => {
                    const value = tooltipItem.raw;
                    return ` ${value} ratings`;
                  },
                },
              },
              legend: {
                position: 'top',
              },
              datalabels: {
                display: false,
              },
              centerText: {
                display: true,
                text: `Total are\n${totalRatings} Ratings`,
              },
            },
          }}
          plugins={[centerTextPlugin]}
        />
      )}
    </div>
  );
}
