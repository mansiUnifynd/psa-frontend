import React from "react";

function AnalysisDashboard({ result }) {
  if (!result) return null;

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
              <div className="d-flex flex-wrap gap-2">
                {result.intent_tokens.map((token, i) => (
                  <span key={i} className="badge bg-primary-subtle text-dark p-2">
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
              <p>{result.summary}</p>
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
              <div className="row g-3">
                {result.recommendations.map((product, i) => (
                  <div key={i} className="col-md-4">
                    <div className="card h-100">
                      {product.image && (
                        <img
                          src={product.image}
                          className="card-img-top"
                          alt={product.title}
                        />
                      )}
                      <div className="card-body">
                        <h6 className="card-title">{product.title}</h6>
                        <a href={product.url} className="btn btn-sm btn-outline-primary" target="_blank">
                          View Product
                        </a>
                        {product.tags?.length > 0 && (
                          <div className="mt-2">
                            {product.tags.map((tag, j) => (
                              <span key={j} className="badge bg-secondary me-1">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default AnalysisDashboard;
