import { useState } from 'react';
import { FileUpload } from './components/FileUpload';
import { Reader } from './components/Reader';
import './App.css';

function App() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  return (
    <div className="app">
      <h1>Web Reader</h1>
      {!selectedFile ? (
        <FileUpload onFileSelect={setSelectedFile} />
      ) : (
        <div>
          <button
            onClick={() => setSelectedFile(null)}
            className="back-button"
          >
            Back to Upload
          </button>
          <Reader file={selectedFile} />
        </div>
      )}
    </div>
  );
}

export default App;