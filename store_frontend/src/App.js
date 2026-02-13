import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import 'bootstrap/dist/css/bootstrap.min.css';

import AdminPage from './pages/AdminPage';

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
        <nav className="navbar navbar-dark bg-dark mb-4">
          <div className="container">
            <span className="navbar-brand mb-0 h1">🛒 SmartCart <small className="text-muted">| Admin Console</small></span>
          </div>
        </nav>
        <Routes>
          <Route path="/" element={<AdminPage sessionId={sessionId} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;