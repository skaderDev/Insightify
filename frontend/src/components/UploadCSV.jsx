import React, { useState } from "react";

function UploadCSV() {
  const [fileName, setFileName] = useState(null);
  const [file, setFile] = useState(null);
  const [validRows, setValidRows] = useState([]);
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const fileInputRef = React.useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.name.endsWith(".csv")) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
    } else {
      alert("Please upload a valid .csv file");
    }
  };

  const handleUpload = async () => {
    if (!file) return alert("No file selected.");

    setLoading(true);
    setShowResults(false);

    const reader = new FileReader();

    reader.onloadend = async () => {
      const base64data = reader.result.split(",")[1];

      try {
        const res = await fetch(
          "https://cik28nujij.execute-api.us-east-1.amazonaws.com/default/upload",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              filename: file.name,
              file: base64data,
            }),
          }
        );

        const json = await res.json();

        setValidRows(json.validRows || []);
        setErrors(json.errors || []);
        setShowResults(true);
      } catch (err) {
        console.error(err);
        alert("Upload failed.");
      } finally {
        setLoading(false);
      }
    };

    reader.readAsDataURL(file);
  };

  return (
    <div style={{ marginTop: "2rem" }}>
      <h2>Upload your CSV</h2>
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv"
        onChange={handleFileChange}
      />

      {fileName && <p>Selected file: {fileName}</p>}
      <button
        onClick={handleUpload}
        disabled={!file}
        style={{ marginTop: "1rem" }}
      >
        Upload
      </button>

      {showResults && (
        <button
          style={{ marginTop: "1rem", marginLeft: "1rem" }}
          onClick={() => {
            setFile(null);
            setFileName(null);
            setValidRows([]);
            setErrors([]);
            setShowResults(false);
            console.log("Current file:", file);
            if (fileInputRef.current) fileInputRef.current.value = "";
          }}
        >
          Clear
        </button>
      )}

      {loading && <p>Loading...</p>}

      {validRows.length > 0 && (
        <div style={{ marginTop: "2rem" }}>
          <h3>✅ Parsed Data</h3>
          <table border="1" cellPadding="8">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Score</th>
              </tr>
            </thead>
            <tbody>
              {validRows.map((row, idx) => (
                <tr key={idx}>
                  <td>{row.name}</td>
                  <td>{row.email}</td>
                  <td>{row.score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {validRows.length > 0 && (
        <button
          style={{ marginTop: "1rem" }}
          onClick={async () => {
            try {
              const res = await fetch(
                "https://zuwdst6mc6.execute-api.us-east-1.amazonaws.com/default/saveInsights",
                {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ validRows }),
                }
              );

              const message = await res.text();
              alert(message);
            } catch (err) {
              console.error(err);
              alert("Save failed.");
            }
          }}
        >
          Confirm and Save
        </button>
      )}

      {errors.length > 0 && (
        <div style={{ marginTop: "2rem", color: "red" }}>
          <h3>Errors Found</h3>
          <ul>
            {errors.map((err, idx) => (
              <li key={idx}>{`Line ${err.line}: ${err.message}`}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default UploadCSV;
