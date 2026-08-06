import { useEffect, useRef } from 'react';
import { Chart } from 'chart.js/auto';
import { useTheme } from '../../hooks/useTheme';

export default function LineChart({ labels, data, height = 320, options = {} }) {
  const canvasRef = useRef(null);
  const { theme } = useTheme();
  const dark = theme === 'dark';

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
            borderColor: dark ? '#93D3C0' : '#1B5E4F',
            backgroundColor: dark ? 'rgba(147, 211, 192, 0.12)' : 'rgba(27, 94, 79, 0.1)',
            fill: true,
            tension: 0.4,
            pointBackgroundColor: dark ? '#93D3C0' : '#1B5E4F',
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
          y: {
            beginAtZero: true,
            grid: { color: dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)' },
            ticks: { color: dark ? '#B0B3B8' : '#5A5A5A' },
          },
          x: {
            grid: { display: false },
            ticks: { color: dark ? '#B0B3B8' : '#5A5A5A' },
          },
        },
        ...options,
      },
    });

    return () => chart.destroy();
  }, [labels, data, options, dark]);

  return (
    <div style={{ height }} className="w-full">
      <canvas ref={canvasRef} />
    </div>
  );
}
