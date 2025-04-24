import { useEffect, useState } from "react";
import FundingBarChart from "./components/FundingBarChart";
import IndustryTrendChart from "./components/IndustryTrendChart";

function App() {
  const [fundingData, setFundingData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIndustry, setSelectedIndustry] = useState("All");
  const [selectedYears, setSelectedYears] = useState([]);

  useEffect(() => {
    fetch("/funding.json")
      .then((res) => res.json())
      .then((data) => {
        setFundingData(data);
        const years = [...new Set(data.map(d => d.year))].sort();
        setSelectedYears(years);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load funding data:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <h2>Loading funding data...</h2>;

  const uniqueIndustries = [...new Set(fundingData.map(d => d.industry))];
  const uniqueYears = [...new Set(fundingData.map(d => d.year))].sort();

  const filteredData = fundingData.filter(d => {
    const industryMatch = selectedIndustry === "All" || d.industry === selectedIndustry;
    const yearMatch = selectedYears.includes(d.year);
    return industryMatch && yearMatch;
  });

  return (
    <div style={{ padding: "1rem" }}>
      <h1>Startup Funding Tracker</h1>

      <div style={{ marginBottom: "1rem" }}>
        <label>Industry: </label>
        <select value={selectedIndustry} onChange={(e) => setSelectedIndustry(e.target.value)}>
          <option value="All">All</option>
          {uniqueIndustries.map((ind, idx) => (
            <option key={idx} value={ind}>{ind}</option>
          ))}
        </select>

        <label style={{ marginLeft: "1rem" }}>Years: </label>
        <select
          multiple
          value={selectedYears}
          onChange={(e) => {
            const options = Array.from(e.target.selectedOptions, opt => opt.value);
            setSelectedYears(options);
          }}
        >
          {uniqueYears.map((yr, idx) => (
            <option key={idx} value={yr}>{yr}</option>
          ))}
        </select>
      </div>

      <FundingBarChart data={filteredData} />
      <IndustryTrendChart data={filteredData} />
    </div>
  );
}

export default App;
