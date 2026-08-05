import { useEffect, useRef } from 'react';
import { Chart } from 'chart.js/auto';

export default function BarChart({ labels, data, colors, height = 300, options = {}, horizontal = false }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return undefined;

    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            data,
            backgroundColor: colors ?? ['#1B5E4F'],
            borderRadius: 8,
            barThickness: 40,
          },
        ],
      },
      options: {
        indexAxis: horizontal ? 'y' : 'x',
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: { grid: { color: 'rgba(0,0,0,0.05)' } },
          x: { grid: { display: false } },
        },
        ...options,
      },
    });

    return () => chart.destroy();
  }, [labels, data, colors, height, options, horizontal]);

  return (
    <div style={{ height }} className="w-full">
      <canvas ref={canvasRef} />
    </div>
  );
}
