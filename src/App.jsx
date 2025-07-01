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
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      if (typeof data === "string" && data.startsWith("❌")) {
        setError(data);
        return;
      }
      setResult(data);
    } catch (err) {
      setError(`❌ Could not connect to backend: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">MCP User Intent Analysis</h1>

        <div className="flex gap-4 mb-6">
          <input
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="Enter user_id"
            className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition"
          >
            {loading ? "Analyzing..." : "Analyze"}
          </button>
        </div>

        {error && <p className="text-red-600 mb-4">{error}</p>}

        {result && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Interest Summary */}
            <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-700 mb-2 flex items-center">
                <span className="mr-2">🔍</span> Interest Summary
              </h2>
              <div className="text-gray-600">
                <p className="font-medium">Shopping Interests:</p>
                <ul className="list-disc list-inside ml-4">
                  <li>Snowboards (Primary)</li>
                  <li>Winter Sports Equipment</li>
                  <li>Outdoor Gear</li>
                </ul>
                <p className="font-medium mt-2">Recent Focus:</p>
                <p>
                  <span className="text-green-600">✔</span> "The Complete Snowboard" - Checkout Initiated
                </p>
              </div>
            </div>

            {/* Intent Tokens Cloud */}
            <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-700 mb-2 flex items-center">
                <span className="mr-2">🌩️</span> Intent Tokens Cloud
              </h2>
              <div className="flex flex-wrap gap-2">
                {result.intent_tokens.map((token, index) => (
                  <span
                    key={index}
                    className={`px-3 py-1 rounded-full text-sm ${
                      ["checkout_intent", "purchase_intent"].includes(token.toLowerCase())
                        ? "bg-orange-200 text-orange-800"
                        : ["cart_indecision", "hesitation"].includes(token.toLowerCase())
                        ? "bg-red-200 text-red-800"
                        : "bg-blue-200 text-blue-800"
                    }`}
                  >
                    {token}
                  </span>
                ))}
              </div>
            </div>

            {/* Session Timeline */}
            <div className="bg-white p-4 rounded-lg shadow border border-gray-200 col-span-full">
              <h2 className="text-xl font-semibold text-gray-700 mb-2 flex items-center">
                <span className="mr-2">📅</span> Session Timeline
              </h2>
              {result.session_timeline.map((session, index) => (
                <details key={index} className="mb-2" open>
                  <summary className="text-lg font-medium text-gray-700 cursor-pointer">
                    Session {session.session_id} <span className="text-gray-400">▼</span>
                  </summary>
                  <ul className="list-disc list-inside ml-4 text-gray-600 mt-2">
                    {session.events.map((event, eventIndex) => (
                      <li key={eventIndex}>
                        {event.occurred_at}: {event.event_type.replace("_", " ").replace("viewed", "Viewed").replace("added", "Added to Cart").replace("removed", "Removed").replace("initiated", "Initiated Checkout")} → {event.pathname}
                      </li>
                    ))}
                  </ul>
                </details>
              ))}
            </div>

            {/* AI Analysis Summary */}
            <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-700 mb-2 flex items-center">
                <span className="mr-2">🤖</span> AI Analysis Summary
              </h2>
              <p className="text-gray-600">
                ★ Based on past behavior, this user is highly engaged with snowboarding products. They’ve explored multiple models, shown signs of comparison and indecision, but recently demonstrated strong purchase intent for "The Complete Snowboard".
              </p>
            </div>

            {/* Personalized Recommendations */}
            <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-700 mb-2 flex items-center">
                <span className="mr-2">🛍️</span> Personalized Recommendations
              </h2>
              <p className="text-gray-600 mb-2">Based on user interest in Hydrogen & Complete models:</p>
              <ul className="list-decimal list-inside text-gray-600">
                <li>The Inventory Not Tracked Snowboard <a href="#" className="text-blue-600 hover:underline">View Product</a></li>
                <li>Gift Card <span className="text-gray-500">(Great fallback + unsure)</span></li>
                <li>The Minimal Snowboard</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;