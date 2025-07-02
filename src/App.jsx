import { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import AnalysisDashboard from "./AnalysisDashboard";

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
    navigate("/show-events");
  };

  return (
    <div className="container py-4">
      <h1 className="mb-4">🧠 MCP User Intent Analysis</h1>

      <div className="input-group mb-4" style={{ maxWidth: "600px" }}>
          <input
            type="text"
            className="form-control shadow-sm rounded-start"
            placeholder="🔍 Enter user_id"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            style={{ fontSize: "1rem", padding: "10px 12px", margin: "10px", width: "500px"}}
          />
          <button
            className="btn btn-primary shadow-sm"
            onClick={handleAnalyze}
            style={{ fontWeight: "500", padding: "10px 16px", margin: "10px" }}
          >
            🔍 Analyze
          </button>
          <button
            className="btn btn-outline-success shadow-sm"
            onClick={goToEventsPage}
            style={{ fontWeight: "500", padding: "10px 16px", margin: "10px" }}
          >
            📊 Show Events
          </button>
        </div>


      {loading && <div className="alert alert-info">⏳ Loading...</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      {result && <AnalysisDashboard result={result} />}
    </div>
  );
}

function ShowEventsPage() {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const socket = new WebSocket("wss://personalized-shopping-assistant.onrender.com/ws/events");

    socket.onmessage = (event) => {
      const newEvent = JSON.parse(event.data);
      setEvents((prevEvents) => [newEvent, ...prevEvents]);
    };

    socket.onerror = () => setError("WebSocket connection failed.");

    return () => socket.close();
  }, []);

  return (
    <div className="container py-4">
      <h1>🛍️ Events on Online Store</h1>

      {error && <div className="alert alert-danger">{error}</div>}

      {events.length > 0 ? (
        <div className="table-responsive">
          <table className="table table-bordered table-striped mt-3">
            <thead className="table-light">
              <tr>
                <th>User Id</th>
                <th>Event Type</th>
                <th>Pathname</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event, index) => (
                <tr key={index}>
                  <td>{event.user_id}</td>
                  <td>{event.event_type}</td>
                  <td>{event.pathname}</td>
                  <td>{event.occurred_at}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>⌛ Waiting for events...</p>
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
