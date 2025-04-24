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
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load funding data:", err);
        setLoading(false);
      });
  }, []);

  // Use string years everywhere for consistent matching
  const uniqueIndustries = [...new Set(fundingData.map(d => d.industry))];
  const uniqueYears = [...new Set(fundingData.map(d => String(d.year)))].sort();

  useEffect(() => {
    if (fundingData.length > 0) {
      setSelectedYears(uniqueYears); // default select all
    }
  }, [fundingData]);

  const filteredData = fundingData.filter(d => {
    const industryMatch = selectedIndustry === "All" || d.industry === selectedIndustry;
    const yearMatch = selectedYears.includes(String(d.year));
    return industryMatch && yearMatch;
  });

  if (loading) return <h2 style={{ padding: "1rem" }}>Loading funding data...</h2>;

  return (
    <div style={{ padding: "1.5rem", fontFamily: "sans-serif", color: "white" }}>
      <h1>Startup Funding Tracker</h1>

      <div style={{ marginBottom: "1rem", display: "flex", flexWrap: "wrap", alignItems: "center", gap: "1.5rem" }}>
        {/* Industry Filter */}
        <div>
          <label><strong>Industry:</strong></label>
          <select
            value={selectedIndustry}
            onChange={(e) => setSelectedIndustry(e.target.value)}
            style={{ marginLeft: "0.5rem", padding: "0.25rem" }}
          >
            <option value="All">All</option>
            {uniqueIndustries.map((ind, idx) => (
              <option key={idx} value={ind}>{ind}</option>
            ))}
          </select>
        </div>

        {/* Year Filter with Select All */}
        <div>
          <label><strong>Years:</strong></label>
          <div style={{ marginTop: "0.25rem" }}>
            <button
              style={{
                padding: "4px 10px",
                background: "#333",
                color: "white",
                border: "1px solid #555",
                borderRadius: "5px",
                cursor: "pointer",
                fontSize: "0.9rem",
              }}
              onClick={() => setSelectedYears(uniqueYears)}
            >
              Select All Years
            </button>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", marginTop: "0.5rem" }}>
            {uniqueYears.map((year, idx) => (
              <label key={idx} style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
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

      {/* Charts */}
      <FundingBarChart data={filteredData} />
      <IndustryTrendChart data={filteredData} />
    </div>
  );
}

export default App;
