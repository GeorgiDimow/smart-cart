import React, { useState, useRef, useEffect } from 'react';
import api from '../services/api';

function ScannerPage() {
  const [imagePreview, setImagePreview] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const [inventory, setInventory] = useState([]); 
  const [matchedProduct, setMatchedProduct] = useState(null);
  const [stockInfo, setStockInfo] = useState(null);
  const [msg, setMsg] = useState('');
  
  const fileInputRef = useRef(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
        const [prodRes, invRes] = await Promise.all([
            api.getProducts(),
            api.getInventory()
        ]);
        setInventory(invRes.data); 
    } catch (e) {
        console.error("Error loading initial data", e);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
      
      setPrediction(null);
      setMatchedProduct(null);
      setStockInfo(null);
      setMsg('');
    }
  };

  const handleScan = async () => {
    if (!imagePreview) return;
    setLoading(true);
    try {
      const res = await api.scanItem(imagePreview);
      const predName = res.data.prediction; 
      setPrediction(res.data);

      if (predName !== "Unsure") {
        const prodRes = await api.getProducts();
        const found = prodRes.data.find(p => p.name.toLowerCase().includes(predName.toLowerCase()));
        
        setMatchedProduct(found || null);

        if (found) {
            const invRes = await api.getInventory();
            const stocks = invRes.data.filter(i => i.productName === found.name);
            setStockInfo(stocks);
        }
      }
    } catch (err) {
      console.error(err);
      setMsg('❌ Error scanning image.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-2">
      <div className="card text-center p-4 shadow-sm border-0 bg-light">
        
        <input 
          type="file" 
          accept="image/*" 
          onChange={handleFileChange} 
          ref={fileInputRef} 
          style={{ display: 'none' }} 
        />
        
        <div className="mb-3">
            <button onClick={() => fileInputRef.current.click()} className="btn btn-outline-primary px-4 py-2">
            📁 Upload Product Photo
            </button>
        </div>

        {imagePreview && (
          <div className="mb-3">
            <img src={imagePreview} alt="Preview" className="img-thumbnail" style={{ maxHeight: '250px' }} />
          </div>
        )}

        {imagePreview && !prediction && (
            <button onClick={handleScan} className="btn btn-success btn-lg" disabled={loading}>
                {loading ? (
                    <span><span className="spinner-border spinner-border-sm me-2"></span>Analyzing...</span>
                ) : (
                    '🔍 Identify & Check Stock'
                )}
            </button>
        )}

        {prediction && (
          <div className="mt-4 animate__animated animate__fadeIn">
             {prediction.prediction === "Unsure" ? (
                <div className="alert alert-warning">
                    <h4>🤔 Unsure ({prediction.confidence})</h4>
                    <p>The AI could not confidently identify this item.</p>
                </div>
             ) : (
                <div>
                    <h3>AI Detected: <span className="text-success fw-bold">{prediction.prediction}</span></h3>
                    
                    {matchedProduct ? (
                        <div className="card mt-3 border-success">
                            <div className="card-header bg-success text-white">
                                <strong>Catalog Match:</strong> {matchedProduct.name} (SKU: {matchedProduct.sku})
                            </div>
                            <div className="card-body">
                                <h5 className="card-title">Stock Availability</h5>
                                {stockInfo && stockInfo.length > 0 ? (
                                    <ul className="list-group list-group-flush">
                                        {stockInfo.map((stock, idx) => (
                                            <li key={idx} className="list-group-item d-flex justify-content-between align-items-center">
                                                <span>🏢 Store #{stock.storeId}</span>
                                                <span className="badge bg-primary rounded-pill">{stock.quantity} Units</span>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <div className="alert alert-danger mb-0">
                                        ❌ Out of Stock in all locations.
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="alert alert-danger mt-3">
                            <strong>Unknown Product:</strong> We identified it as "{prediction.prediction}", but it is not in your product catalog.
                            <br/>
                            <small>Go to the "Product Manager" tab to add it.</small>
                        </div>
                    )}
                </div>
             )}
          </div>
        )}

        {msg && <div className="alert alert-danger mt-2">{msg}</div>}
      </div>
    </div>
  );
}

export default ScannerPage;