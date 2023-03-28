import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `https://api.nasa.gov/neo/rest/v1/neo/browse?api_key=G7ggBB8HX46knK1ODzE8HM6BL3nvvadzKEahVqjD`
        );
        const dataPoints = res.data.near_earth_objects.map((item) => ({
          id: item.id,
          name: item.name,
          date: item.close_approach_data[0]?.close_approach_date_full,
          absoluteMagnitude: item.absolute_magnitude_h,
          estimatedDiameter: item.estimated_diameter.kilometers.estimated_diameter_max,
        }));
        const uniqueDataPoints = [
          ...new Map(dataPoints.map((item) => [item.id, item])).values(),
        ].slice(0, 15);
        setData(uniqueDataPoints);
        setFilteredData(uniqueDataPoints);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  const handleFilterChange = (e) => {
    setSearchQuery(e.target.value);
    const filteredData = data.filter(
      (item) =>
        item.name.toLowerCase().includes(e.target.value.toLowerCase()) ||
        item.date.toLowerCase().includes(e.target.value.toLowerCase()) ||
        item.absoluteMagnitude
          .toString()
          .toLowerCase()
          .includes(e.target.value.toLowerCase()) ||
        item.estimatedDiameter
          .toString()
          .toLowerCase()
          .includes(e.target.value.toLowerCase())
    );
    setFilteredData(filteredData);
  };

  return (
    <div className="App">
      <header>
        <h1>Welcome to NASA</h1>
        <h3>Data Set Size: {data.length} </h3>
        <h3>
        Average Magnitude:{" "}
              {filteredData.reduce(
                (sum, item) => sum + Math.abs(item.absoluteMagnitude),
                0
              ) / filteredData.length}
        </h3>
        <h3>
        Average Diameter:{" "}
              {filteredData.reduce(
                (sum, item) => sum + Math.abs(item.estimatedDiameter),
                0
              ) / filteredData.length}
        </h3>
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={handleFilterChange}
        />
      </header>
      <section>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Date</th>
              <th>Absolute Magnitude</th>
              <th>Estimated Diameter (km)</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item) => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.date}</td>
                <td>{item.absoluteMagnitude}</td>
                <td>{item.estimatedDiameter}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}

export default App;


