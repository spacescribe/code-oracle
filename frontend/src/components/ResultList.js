import React from "react";
import "./ResultList.css"

function ResultList({ results }) {
  if (!results.length) return <p>No results yet.</p>

  return (
    <div className="results">
      {results.map((r) => (
        <div key={r.id} className="result-card">
          <p className="result-path">{r.repo}/{r.path}</p>
          <pre className="result-snippet">
            {r.content.slice(0, 300)}{r.content.length > 300 ? "..." : ""}
          </pre>
        </div>
      ))}
    </div>
  )
}


export default ResultList