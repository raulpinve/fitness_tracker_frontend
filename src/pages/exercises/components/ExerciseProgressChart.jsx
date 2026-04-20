import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// Registramos los motores de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

const ExerciseProgressChart = ({ data }) => {
    // 1. Preparamos los datos para Chart.js
    const chartData = {
        labels: data.map(d => d.date),
        datasets: [
            {
                fill: true,
                label: 'Peso',
                data: data.map(d => d.value),
                borderColor: '#2563eb', // Azul TYTAN
                borderWidth: 4,
                backgroundColor: (context) => {
                    const ctx = context.chart.ctx;
                    const gradient = ctx.createLinearGradient(0, 0, 0, 200);
                    gradient.addColorStop(0, 'rgba(37, 99, 235, 0.3)');
                    gradient.addColorStop(1, 'rgba(37, 99, 235, 0)');
                    return gradient;
                },
                lineTension: 0.4, // Suavizado monotone
                pointRadius: 4,
                pointBackgroundColor: '#09090b',
                pointBorderColor: '#2563eb',
                pointBorderWidth: 2.5,
                pointHoverRadius: 6,
                pointHoverBackgroundColor: '#2563eb',
                pointHoverBorderColor: '#ffffff',
                pointHoverBorderWidth: 2,
            },
        ],
    };

    // 2. Opciones de configuración (Estética Industrial)
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                enabled: true,
                backgroundColor: '#18181b', // Zinc-900
                titleFont: { size: 10, weight: '900', family: 'Inter' },
                bodyFont: { size: 16, weight: '900', family: 'Inter' },
                padding: 12,
                cornerRadius: 16,
                displayColors: false,
                callbacks: {
                    label: (context) => `${context.parsed.y} KG`,
                }
            },
        },
        scales: {
            x: {
                grid: { display: false },
                border: { display: false },
                ticks: {
                    color: '#52525b',
                    font: { size: 9, weight: '900' },
                    padding: 10,
                },
            },
            y: {
                grid: { 
                    color: 'rgba(39, 39, 42, 0.1)',
                    drawTicks: false,
                },
                border: { display: false, dash: [4, 4] },
                ticks: {
                    color: '#52525b',
                    font: { size: 9, weight: '900' },
                    padding: 10,
                    callback: (value) => `${value}kg`
                },
            },
        },
    };

    return (
        <div className="bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-900 rounded-[2rem] p-6 shadow-sm mb-6 overflow-hidden">
            {/* Header Idéntico */}
            <div className="flex justify-between items-start mb-8">
                <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-black text-blue-600 dark:text-blue-500 uppercase tracking-[0.3em] leading-none">
                        DATA / EVOLUCIÓN
                    </span>
                    <h3 className="text-xl font-black text-zinc-800 dark:text-zinc-100 uppercase italic tracking-tighter leading-none">
                        Progreso de Carga
                    </h3>
                </div>
                <div className="bg-zinc-100 dark:bg-zinc-900 px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800">
                    <span className="text-[9px] font-black text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">
                        Unidad: KG
                    </span>
                </div>
            </div>

            <div className="w-full" style={{ height: '220px' }}>
                <Line data={chartData} options={options} />
            </div>

            {/* Footer técnico */}
            <div className="mt-8 pt-4 border-t border-zinc-100 dark:border-zinc-900 flex justify-between items-center">
                <span className="text-[8px] font-black text-zinc-400 uppercase tracking-[0.3em]">Sistema de Registro v1.0</span>
                <div className="h-1.5 w-12 bg-zinc-100 dark:bg-zinc-900 rounded-full overflow-hidden">
                    <div className="h-full w-2/3 bg-blue-600 rounded-full" />
                </div>
            </div>
        </div>
    );
};

export default ExerciseProgressChart;
