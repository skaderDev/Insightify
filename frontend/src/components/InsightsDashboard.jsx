import React, { useEffect, useState } from "react";

function InsightsDashboard() {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [preview, setPreview] = useState(null);

  // Fetch list of uploaded insight files
  useEffect(() => {
    async function fetchInsights() {
      try {
        const res = await fetch(
          "https://zuwdst6mc6.execute-api.us-east-1.amazonaws.com/default/listInsights"
        );
        const result = await res.json();

        const parsed =
          typeof result.body === "string"
            ? JSON.parse(result.body)
            : result.body;

        setInsights(Array.isArray(parsed) ? parsed : []);
      } catch (err) {
        console.error("Error fetching insights:", err);
        setInsights([]);
      } finally {
        setLoading(false);
      }
    }

    fetchInsights();
  }, []);

  async function fetchInsight(key) {
    setSelected(key);
    setPreview("Loading...");

    try {
      const res = await fetch(
        `https://zuwdst6mc6.execute-api.us-east-1.amazonaws.com/default/getInsight?key=${encodeURIComponent(
          key
        )}`
      );
      const result = await res.json();

      console.log("Raw Lambda result:", result);

      let parsed;
      try {
        parsed = typeof result === "string" ? JSON.parse(result) : result;
      } catch (e) {
        console.error("Failed to parse preview:", e);
      }

      console.log("Parsed result:", parsed);
      setPreview(parsed);
    } catch (err) {
      console.error("Error fetching insight:", err);
      setPreview("Failed to load.");
    }
  }

  return (
    <div style={{ marginTop: "2rem" }}>
      <h2>Uploaded Insights</h2>
      {loading ? (
        <p>Loading...</p>
      ) : insights.length === 0 ? (
        <p>No uploads found.</p>
      ) : (
        <table border="1" cellPadding="8">
          <thead>
            <tr>
              <th>File Key</th>
              <th>Last Modified</th>
              <th>Size (bytes)</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {insights.map((file, idx) => (
              <tr key={idx}>
                <td>{file.key}</td>
                <td>{new Date(file.lastModified).toLocaleString()}</td>
                <td>{file.size}</td>
                <td>
                  <button onClick={() => fetchInsight(file.key)}>View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {selected && (
        <div style={{ marginTop: "2rem" }}>
          <h3>
            Preview: <code>{selected}</code>
          </h3>
          <pre
            style={{
              background: "#eee",
              padding: "1rem",
              maxHeight: "300px",
              overflow: "auto",
              color: "#000",
            }}
          >
            {typeof preview === "string"
              ? preview
              : JSON.stringify(preview, null, 2)}
          </pre>
          <button
            onClick={() => {
              setSelected(null);
              setPreview(null);
            }}
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}

export default InsightsDashboard;
