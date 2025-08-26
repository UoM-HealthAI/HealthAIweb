import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Models from './pages/Models';
import Upload from './pages/Upload';
import Results from './pages/Results';
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
            <a href="http://localhost:8001" target="_blank" rel="noopener noreferrer">
              Documentation
            </a>
          </div>
        </nav>

        {/* Page content will be displayed here */}
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/models" element={<Models />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/results/:taskId" element={<Results />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
