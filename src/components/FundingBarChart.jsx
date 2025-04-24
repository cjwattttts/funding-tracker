import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const FundingBarChart = ({ data }) => {
  const totalsByYear = {};

  data.forEach((item) => {
    const year = item.year;
    const amount = parseFloat(item.amount);
    totalsByYear[year] = (totalsByYear[year] || 0) + amount;
  });

  const labels = Object.keys(totalsByYear);
  const values = Object.values(totalsByYear);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Total Funding ($)",
        data: values,
        backgroundColor: labels.map((_, i) => `hsl(${i * 50}, 70%, 60%)`),
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: "Total Startup Funding by Year",
        color: "#fff",
        font: {
          size: 18,
          weight: "bold",
        },
        padding: { bottom: 20 },
      },
    },
    scales: {
      x: {
        ticks: { color: "#fff" },
        grid: { color: "#333" },
      },
      y: {
        ticks: { color: "#fff" },
        grid: { color: "#333" },
      },
    },
  };

  return <Bar data={chartData} options={options} />;
};

export default FundingBarChart;
