import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";
//import "./BarChart.css";
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const CustomBarChart = ({ data }) => {
    const colorPalette = ["#4f83cc", "#f76c6c", "#f9a620", "#34a853", "#ff8a65"];
    const hoverPalette = ["#2f5b99", "#c74444", "#e07b1a", "#2e7d32", "#ff7043"];
    
    const chartData = {
        labels: data.map(item => item.name || item.title),
        datasets: [
            {
                label: "Broj odrađenih termina",
                data: data.map(item => item.sessionCount),
                backgroundColor: data.map((_, index) => colorPalette[index % colorPalette.length]),
                borderRadius: 15,
                barPercentage: 0.6,
                hoverBackgroundColor: data.map((_, index) => hoverPalette[index % hoverPalette.length])
            }
        ]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                enabled: true,
                backgroundColor: "#333",
                titleColor: "#fff",
                bodyColor: "#fff",
                borderColor: "#777",
                borderWidth: 1,
                cornerRadius: 4
            }
        },
        scales: {
            x: {
                grid: {
                    display: false
                },
                ticks: {
                    color: "#999",
                    font: {
                        family: "Arial",
                        size: 12
                    }
                }
            },
            y: {
                grid: {
                    color: "#eee",
                    lineWidth: 1,
                    drawBorder: false
                },
                ticks: {
                    color: "#666",
                    font: {
                        family: "Arial",
                        size: 12
                    },
                    padding: 10,
                    callback: function(value) {
                        if (Number.isInteger(value)) {
                            return value;
                        }
                    },
                    stepSize: 1
                },
                beginAtZero: true
            }
        },
        animation: {
            duration: 1000,
            easing: "easeOutQuart"
        }
    };

    return (
        <div className="chart-container" style={{ width: "100%", height: "300px" }}>
            <Bar data={chartData} options={options} />
        </div>
    );
};

export default CustomBarChart;
