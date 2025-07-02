import { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";

function HomePage() {
  const [userId, setUserId] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleAnalyze = async () => {
    if (!userId.trim()) {
      setError("Please enter a valid user ID.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

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

  const goToEventsPage = () => {
    navigate("/show-events"); // ✅ navigate to show-events page
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
      <button onClick={handleAnalyze} style={{ marginLeft: 10, padding: "10px 20px" }}>
        Analyze
      </button>

      {/* ✅ NEW Show Events Button */}
      <button
        onClick={goToEventsPage}
        style={{
          marginLeft: 10,
          padding: "10px 20px",
          backgroundColor: "#4CAF50",
          color: "white",
          border: "none",
        }}
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
    </div>
  );
}
function ShowEventsPage() {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    // Connect to WebSocket
    const socket = new WebSocket("wss://personalized-shopping-assistant.onrender.com/ws/events");

    socket.onmessage = (event) => {
      const newEvent = JSON.parse(event.data);
      setEvents((prevEvents) => [newEvent, ...prevEvents]);
    };

    socket.onerror = () => setError("WebSocket connection failed.");

    return () => socket.close();  // Clean up on unmount
  }, []);

  return (
    <div style={{ padding: 30, fontFamily: "Arial" }}>
      <h1>Events on Online Store</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {events.length > 0 ? (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "#f2f2f2" }}>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>User Id</th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>Event Type</th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>Pathname</th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event, index) => (
              <tr key={index}>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>{event.user_id}</td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>{event.event_type}</td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>{event.pathname}</td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>{event.occurred_at}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Waiting for events...</p>
      )}
    </div>
  );
}


function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/show-events" element={<ShowEventsPage />} />
    </Routes>
  );
}

export default App;
