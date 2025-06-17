import React, { useState } from "react";

function UploadCSV() {
  const [fileName, setFileName] = useState(null);
  const [file, setFile] = useState(null);

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

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://localhost:4000/upload", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();
      alert(`Success: ${result.message}`);
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    }
  };

  return (
    <div style={{ marginTop: "2rem" }}>
      <h2>Upload your CSV</h2>
      <input type="file" accept=".csv" onChange={handleFileChange} />
      {fileName && <p>Selected file: {fileName}</p>}
      <button
        onClick={handleUpload}
        disabled={!file}
        style={{ marginTop: "1rem" }}
      >
        Upload
      </button>
    </div>
  );
}

export default UploadCSV;
