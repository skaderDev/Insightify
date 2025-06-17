import React from 'react';
import UploadCSV from './components/UploadCSV';

function App() {
  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Insightify</h1>
      <UploadCSV />
    </div>
  );
}

export default App;
