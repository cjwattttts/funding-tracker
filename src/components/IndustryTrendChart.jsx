import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend);

const IndustryTrendChart = ({ data }) => {
  const groupedData = {};

  data.forEach((item) => {
    const { year, industry, amount } = item;
    const amt = parseFloat(amount);

    if (!groupedData[industry]) groupedData[industry] = {};
    groupedData[industry][year] = (groupedData[industry][year] || 0) + amt;
  });

  const years = Array.from(new Set(data.map((d) => d.year))).sort();

  const chartData = {
    labels: years,
    datasets: Object.entries(groupedData).map(([industry, yearlyData]) => ({
      label: industry,
      data: years.map((y) => yearlyData[y] || 0),
      fill: false,
      borderWidth: 2,
    })),
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Funding Trends by Industry" },
    },
  };

  return <Line data={chartData} options={options} />;
};

export default IndustryTrendChart;
