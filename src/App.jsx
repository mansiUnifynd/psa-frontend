import { useState } from "react";

function App() {
  const [userId, setUserId] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [events, setEvents] = useState([]); // ✅ ADDED inside component

  const handleAnalyze = async () => {
    if (!userId.trim()) {
      setError("Please enter a valid user ID.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);
    setEvents([]); // Optional: Clear old events

    try {
      const res = await fetch(`https://personalized-shopping-assistant.onrender.com/analyze?user_id=${userId}`);
      const data = await res.json();
      setResult(data.result);
    } catch (err) {
      setError("❌ Could not connect to backend.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ NEW FUNCTION to fetch all events
  const handleShowEvents = async () => {
    setLoading(true);
    setError("");
    setResult(null); // Optional: Clear analysis if showing events

    try {
      const res = await fetch("https://personalized-shopping-assistant.onrender.com/get-events");
      const data = await res.json();
      setEvents(data.events);
    } catch (err) {
      setError("❌ Could not fetch events.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 30, fontFamily: "Arial" }}>
      <h1>MCP User Intent Analysis</h1>

      <input
        style={{ padding: 10, width: "300px" }}
        type="text"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
        placeholder="Enter user_id"
      />
      <button
        onClick={handleAnalyze}
        style={{ marginLeft: 10, padding: "10px 20px" }}
      >
        Analyze
      </button>
      {/* ✅ NEW BUTTON */}
      <button
        onClick={handleShowEvents}
        style={{ marginLeft: 10, padding: "10px 20px", backgroundColor: "#4CAF50", color: "white", border: "none" }}
      >
        Show Events
      </button>

      {loading && <p>⏳ Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {result && (
        <div style={{ marginTop: 20 }}>
          <h2>Analysis Result</h2>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}

      {/* ✅ EVENTS TABLE */}
      {events.length > 0 && (
        <div style={{ marginTop: 30 }}>
          <h2>All Shopify Events</h2>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ backgroundColor: "#f2f2f2" }}>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>Event Type</th>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>Pathname</th>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event, index) => (
                <tr key={index}>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>{event.event_type}</td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>{event.pathname}</td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>{event.occurred_at}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default App;
