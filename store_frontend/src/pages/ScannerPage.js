import React, { useState, useRef, useEffect } from 'react';
import api from '../services/api';

function ScannerPage({ sessionId }) {
  const [imagePreview, setImagePreview] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [matchedProduct, setMatchedProduct] = useState(null);
  const [msg, setMsg] = useState('');
  
  const fileInputRef = useRef(null);
  useEffect(() => {
    api.getProducts().then(res => setProducts(res.data));
  }, []);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
      setPrediction(null);
      setMatchedProduct(null);
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
        const found = products.find(p => p.name.toLowerCase().includes(predName.toLowerCase()));
        setMatchedProduct(found || null);
      }
    } catch (err) {
      console.error(err);
      setMsg('Error scanning image.');
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async () => {
    if (!matchedProduct) return;
    try {
      await api.addToCart(sessionId, matchedProduct.sku, 1);
      setMsg(`✅ Added ${matchedProduct.name} to cart!`);
    } catch (err) {
      setMsg('Failed to add to cart.');
    }
  };

  return (
    <div className="container mt-4">
      <h2>📸 AI Product Scanner</h2>
      
      <div className="card text-center p-4 shadow-sm">
        <input 
          type="file" 
          accept="image/*" 
          onChange={handleFileChange} 
          ref={fileInputRef} 
          style={{ display: 'none' }} 
        />
        
        <div className="mb-3">
            <button onClick={() => fileInputRef.current.click()} className="btn btn-outline-primary me-2">
            📁 Upload Photo
            </button>
        </div>

        {imagePreview && (
          <div className="mb-3">
            <img src={imagePreview} alt="Preview" style={{ maxHeight: '200px', borderRadius: '10px' }} />
          </div>
        )}

        {imagePreview && !prediction && (
            <button onClick={handleScan} className="btn btn-success" disabled={loading}>
                {loading ? 'Scanning...' : '🔍 Identify Item'}
            </button>
        )}

        {prediction && (
          <div className="mt-3 animate__animated animate__fadeIn">
             {prediction.prediction === "Unsure" ? (
                <h3 className="text-warning">🤔 Unsure ({prediction.confidence})</h3>
             ) : (
                <div>
                    <h3>It looks like a <span className="text-success">{prediction.prediction}</span></h3>
                    
                    {matchedProduct ? (
                        <div className="alert alert-info mt-2">
                            <strong>Found in Store:</strong> {matchedProduct.name} - ${matchedProduct.price}
                            <br/>
                            <button className="btn btn-primary mt-2" onClick={addToCart}>
                                🛒 Add to Cart
                            </button>
                        </div>
                    ) : (
                        <p className="text-danger">But we don't sell this item yet.</p>
                    )}
                </div>
             )}
          </div>
        )}

        {msg && <div className="alert alert-light mt-2">{msg}</div>}
      </div>
    </div>
  );
}

export default ScannerPage;