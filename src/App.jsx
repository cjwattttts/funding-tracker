import { useEffect, useState } from "react";
import './index.css';
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
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load funding data:", err);
        setLoading(false);
      });
  }, []);

  const uniqueIndustries = [...new Set(fundingData.map(d => d.industry))];
  const uniqueYears = [...new Set(fundingData.map(d => String(d.year)))].sort();

  useEffect(() => {
    if (fundingData.length > 0) {
      setSelectedYears(uniqueYears);
    }
  }, [fundingData]);

  const filteredData = fundingData.filter(d => {
    const industryMatch = selectedIndustry === "All" || d.industry === selectedIndustry;
    const yearMatch = selectedYears.includes(String(d.year));
    return industryMatch && yearMatch;
  });

  if (loading) return <h2 style={{ padding: "1rem" }}>Loading funding data...</h2>;

  return (
    <div className="container">
      <h1>Startup Funding Tracker</h1>

      <div className="filters">
        {/* Industry Filter */}
        <div className="filter-group">
          <label>Industry:</label>
          <select
            value={selectedIndustry}
            onChange={(e) => setSelectedIndustry(e.target.value)}
          >
            <option value="All">All</option>
            {uniqueIndustries.map((ind, idx) => (
              <option key={idx} value={ind}>{ind}</option>
            ))}
          </select>
        </div>

        {/* Year Filter */}
        <div className="filter-group">
          <label>Years:</label>
          <button onClick={() => setSelectedYears(uniqueYears)}>Select All Years</button>
          <div className="year-checks">
            {uniqueYears.map((year, idx) => (
              <label key={idx} className="checkbox-label">
                <input
                  type="checkbox"
                  checked={selectedYears.includes(year)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedYears((prev) => [...prev, year]);
                    } else {
                      setSelectedYears((prev) => prev.filter((y) => y !== year));
                    }
                  }}
                />
                {year}
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="chart-container">
        <FundingBarChart data={filteredData} />
      </div>
      <div className="chart-container">
        <IndustryTrendChart data={filteredData} />
      </div>
    </div>
  );
}

export default App;
