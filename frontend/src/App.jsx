import React from 'react';
import UploadCSV from './components/UploadCSV';
import InsightsDashboard from "./components/InsightsDashboard";


function App() {
  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Insightify</h1>
      <InsightsDashboard />
      <UploadCSV />
    </div>
  );
}

export default App;
