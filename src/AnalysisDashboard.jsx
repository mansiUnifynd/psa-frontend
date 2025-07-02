import React from "react";

function AnalysisDashboard({ result }) {
  if (!result) return null;

  const getColorForToken = (token) => {
    if (token.includes("shopping") || token.includes("interested")) return "#198754"; // green
    if (token.includes("browsing") || token.includes("homepage")) return "#0dcaf0"; // blue
    if (token.includes("compare") || token.includes("indecision")) return "#0d6efd"; // primary
    if (token.includes("intent") || token.includes("checkout")) return "#ffc107"; // warning
    if (token.includes("purchase") || token.includes("hesitation")) return "#dc3545"; // red
    return "#6c757d"; // gray
  };
  

  return (
    <div className="container mt-5">
      <div className="row g-4">

        {/* Interest Summary */}
        <div className="col-lg-4">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h5 className="card-title">🔍 Interest Summary</h5>
              <ul className="list-unstyled mb-2">
                {result.interests.map((interest, i) => (
                  <li key={i}>🛒 {interest}</li>
                ))}
              </ul>
              <p className="mt-3">
                ✅ <strong>Recent Focus:</strong><br />
                → {result.recent_focus.product} — <em>{result.recent_focus.status}</em>
              </p>
            </div>
          </div>
        </div>

        {/* Token Cloud */}

        <div className="col-lg-4">
        <div className="card shadow-sm h-100">
            <div className="card-body">
            <h5 className="card-title">🧩 Intent Tokens Cloud</h5>
            <div className="d-flex flex-wrap">
                {result.intent_tokens.map((token, i) => (
                <span
                    key={i}
                    className="badge text-white me-2 mb-2 px-3 py-2"
                    style={{
                    backgroundColor: getColorForToken(token),
                    fontSize: "0.85rem",
                    borderRadius: "20px",
                    whiteSpace: "normal",
                    }}
                >
                    {token}
                </span>
                ))}
            </div>
            </div>
        </div>
        </div>


        {/* AI Summary */}
        <div className="col-lg-4">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h5 className="card-title">🧠 AI Analysis Summary</h5>
              {result.summary.split("\n\n").map((para, i) => (
                <p key={i} className="mb-2">{para}</p>
              ))}
            </div>
          </div>
        </div>

        {/* Session Timeline */}
        <div className="col-12">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title">🕓 Session Timeline</h5>
              {result.session_timeline.map((session) => (
                <div key={session.session_id} className="mb-3">
                  <h6 className="fw-semibold">Session {session.session_id}</h6>
                  <ul className="ps-3">
                    {session.events.map((e, i) => (
                      <li key={i}>
                        → <strong>{e.event_type}</strong> — {e.pathname}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="col-12">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title">🛍️ Personalized Recommendations</h5>
              <ul className="list-group list-group-flush">
                {result.recommendations.map((product, i) => (
                  <li key={i} className="list-group-item">
                    <a
                      href={product.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-decoration-none"
                    >
                      {i + 1}. {product.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default AnalysisDashboard;
