import React from "react";
import "./AnalysisDashboard.css"; // Add custom CSS file

function AnalysisDashboard({ result }) {
  if (!result) return null;

  const getColorForToken = (token) => {
    if (token.includes("shopping") || token.includes("interested")) return "#dfcfcc "; // green
    if (token.includes("browsing") || token.includes("homepage")) return "#dfcfcc"; // blue
    if (token.includes("compare") || token.includes("indecision")) return "#dfcfcc"; // primary
    if (token.includes("intent") || token.includes("checkout")) return "#dfcfcc"; // warning
    if (token.includes("purchase") || token.includes("hesitation") || token.includes("purchased")) return "#dfcfcc"; // red
    if (token.includes("casual") || token.includes("viewing")) return "#dfcfcc"; // gray
    return "#616161"; // default gray
  };

  // Generate random style for dynamic cloud effect
  const getRandomStyle = (index) => {
    const size = 1; // Random font size between 1.0rem and 1.3rem
    const offsetX = 15; // Random X offset between -10px and 10px
    const offsetY = 5; // Random Y offset between -7px and 7px
    const zIndex = Math.floor(Math.random() * 10) + 1; // Random z-index for layering
    return { 
      fontSize: `${size}rem`, 
      transform: `translate(${offsetX}px, ${offsetY}px)`,
      zIndex,
    };
  };

  return (
    <div className="container mt-5">
      <div className="row g-4">

        {/* Intent Tokens Cloud */}
        <div className="col-lg-4">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h5 className="card-title">🧩 Intent Tokens Cloud</h5>
              <div className="token-cloud">
                {result.intent_tokens.map((token, i) => (
                  <div key={i} className="token-item" style={getRandomStyle(i)}>
                    <div
                      className="badge text-white text-center"
                      style={{
                        backgroundColor: getColorForToken(token),
                        borderRadius: "15px",
                        padding: "5px 10px",
                        whiteSpace: "normal",
                        minWidth: "100px",
                      }}
                    >
                      {token}
                    </div>
                  </div>
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