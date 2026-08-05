import { useEffect, useRef } from 'react';
import { Chart } from 'chart.js/auto';

export default function LineChart({ labels, data, height = 320, options = {} }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return undefined;

    const chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Consultations',
            data,
            borderColor: '#1B5E4F',
            backgroundColor: 'rgba(27, 94, 79, 0.1)',
            fill: true,
            tension: 0.4,
            pointBackgroundColor: '#1B5E4F',
            pointRadius: 5,
            pointHoverRadius: 8,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.05)' } },
          x: { grid: { display: false } },
        },
        ...options,
      },
    });

    return () => chart.destroy();
  }, [labels, data, options]);

  return (
    <div style={{ height }} className="w-full">
      <canvas ref={canvasRef} />
    </div>
  );
}
