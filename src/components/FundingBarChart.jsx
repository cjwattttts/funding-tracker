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

  const chartData = {
    labels: Object.keys(totalsByYear),
    datasets: [
      {
        label: "Total Funding ($)",
        data: Object.values(totalsByYear),
        backgroundColor: "rgba(75,192,192,0.6)",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Total Funding by Year" },
    },
  };

  return <Bar data={chartData} options={options} />;
};

export default FundingBarChart;
