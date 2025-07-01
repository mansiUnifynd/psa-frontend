import { useState } from "react";

function App() {
  const [userId, setUserId] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

      {loading && <p>⏳ Analyzing...</p>}
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

export default App;
