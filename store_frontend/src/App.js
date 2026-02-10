import React, { useState, useRef } from 'react';
import axios from 'axios';
import './App.css'; 

function App() {
  const [prediction, setPrediction] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result); 
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!imagePreview) return;

    try {
      const response = await axios.post('http://localhost:8080/api/scan', {
        image: imagePreview 
      });
      setPrediction(response.data);
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Error processing image.");
    }
  };

  return (
    <div className="App">
      <h1>🍏 AI Fruit Scanner</h1>
      
      <div className="card">
        <input 
          type="file" 
          accept="image/*" 
          onChange={handleFileChange} 
          ref={fileInputRef} 
          style={{ display: 'none' }} 
        />

        <button onClick={() => fileInputRef.current.click()} className="btn-upload">
          📁 Choose Image
        </button>

        {imagePreview && (
          <div className="preview-container">
            <img src={imagePreview} alt="Preview" className="preview-image" />
            <button onClick={handleUpload} className="btn-scan">🔍 Identify Item</button>
          </div>
        )}

        {prediction && (
          <div className="result-box">
             {prediction.prediction === "Unsure" ? (
                <h2 style={{color: 'orange'}}>🤔 Unsure ({prediction.confidence})</h2>
             ) : (
                <h2>It's a: <span style={{color: 'green'}}>{prediction.prediction}</span></h2>
             )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;