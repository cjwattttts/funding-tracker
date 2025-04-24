import { useEffect, useState } from "react";
import FundingBarChart from "./components/FundingBarChart";
import IndustryTrendChart from "./components/IndustryTrendChart";

function App() {
  const [fundingData, setFundingData] = useState([]);

  useEffect(() => {
    fetch("/funding.json")
      .then((res) => res.json())
      .then((data) => setFundingData(data))
      .catch((err) => console.error("Error loading funding data:", err));
  }, []);

  return (
    <div>
      <h1>Startup Funding Tracker</h1>
      <FundingBarChart data={fundingData} />
      <IndustryTrendChart data={fundingData} />
    </div>
  );
}

export default App;
