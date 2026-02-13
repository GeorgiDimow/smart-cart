import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import 'bootstrap/dist/css/bootstrap.min.css';

import ShopPage from './pages/ShopPage';
import ScannerPage from './pages/ScannerPage';

function App() {
  const [sessionId, setSessionId] = useState('');

  useEffect(() => {
    let storedSession = localStorage.getItem('smart_cart_session');
    if (!storedSession) {
      storedSession = uuidv4();
      localStorage.setItem('smart_cart_session', storedSession);
    }
    setSessionId(storedSession);
  }, []);

  return (
    <Router>
      <div className="App">
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
          <div className="container">
            <Link className="navbar-brand" to="/">🛒 SmartCart</Link>
            <div className="navbar-nav">
              <Link className="nav-link" to="/">Store</Link>
              <Link className="nav-link" to="/scan">📷 AI Scanner</Link>
            </div>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<ShopPage sessionId={sessionId} />} />
          <Route path="/scan" element={<ScannerPage sessionId={sessionId} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;