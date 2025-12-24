import React, { useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

function SearchBus() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    const fromQuery = from.trim().toLowerCase();
    const toQuery = to.trim().toLowerCase();

    if (!fromQuery || !toQuery) {
      setError("Please enter both From and To locations");
      return;
    }

    setLoading(true);
    setError("");
    setResults([]);

    try {
      const res = await axios.get(
        `${API_URL}/api/buses/search?from=${fromQuery}&to=${toQuery}`
      );

      if (res.data?.success) {
        setResults(res.data.buses || []);
      } else {
        setResults([]);
        setError("No buses found");
      }
    } catch (err) {
      console.error("Search error:", err);
      setError("Something went wrong while searching buses");
    } finally {
      setLoading(false);
    }
  };

  const swapLocations = () => {
    setFrom(to);
    setTo(from);
  };

  const clearSearch = () => {
    setFrom("");
    setTo("");
    setResults([]);
    setError("");
  };

  return (
    <div style={{ maxWidth: "900px", margin: "auto", padding: "20px" }}>
      <h2>Search Bus</h2>

      {/* SEARCH INPUTS */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
        <input
          type="text"
          placeholder="From"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
        />
        <button onClick={swapLocations}>⇄</button>
        <input
          type="text"
          placeholder="To"
          value={to}
          onChange={(e) => setTo(e.target.value)}
        />
      </div>

      {/* BUTTONS */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
        <button onClick={handleSearch} disabled={loading}>
          {loading ? "Searching..." : "Find Bus"}
        </button>
        <button onClick={clearSearch}>Clear</button>
      </div>

      {/* ERROR */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* RESULTS */}
      {results.length === 0 && !loading && !error && (
        <p>No buses available</p>
      )}

      {results.map((bus, index) => (
        <div
          key={bus._id || index}
          style={{
            border: "1px solid #ccc",
            padding: "15px",
            marginBottom: "15px",
            borderRadius: "8px",
          }}
        >
          <h3>
            {bus.busName} ({bus.busNumber})
          </h3>

          <p>
            <strong>Type:</strong> {bus.busType || "N/A"} |{" "}
            <strong>Fare:</strong> ₹{bus.fare || "N/A"} |{" "}
            <strong>Capacity:</strong> {bus.capacity || "N/A"}
          </p>

          {/* STOPPAGES TABLE */}
          <h4>Stoppages</h4>

          {Array.isArray(bus.stoppages) && bus.stoppages.length > 0 ? (
            <table
              border="1"
              cellPadding="8"
              style={{ width: "100%", borderCollapse: "collapse" }}
            >
              <thead>
                <tr>
                  <th>Stop Name</th>
                  <th>Going Time</th>
                  <th>Return Time</th>
                </tr>
              </thead>
              <tbody>
                {bus.stoppages.map((stop, i) => (
                  <tr key={i}>
                    <td>{stop.name || "N/A"}</td>
                    <td>{stop.goingTime || "N/A"}</td>
                    <td>{stop.returnTime || "N/A"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p style={{ color: "gray" }}>No stoppage data available</p>
          )}

          <br />
          <button>Book Bus</button>
        </div>
      ))}
    </div>
  );
}

export default SearchBus;
