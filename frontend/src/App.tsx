import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Models from './pages/Models';
import Upload from './pages/Upload';
import Results from './pages/Results';
import Help from './pages/Help';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        {/* Top navigation bar */}
        <nav className="navbar">
          <h1>HealthAI Web Platform</h1>
          <div className="nav-links">
            <Link to="/">Home</Link>
            <Link to="/models">Models</Link>
            <Link to="/upload">Upload</Link>
            <Link to="/help">Help</Link>
          </div>
        </nav>

        {/* Page content will be displayed here */}
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/models" element={<Models />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/results/:taskId" element={<Results />} />
            <Route path="/help" element={<Help />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
