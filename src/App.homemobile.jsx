import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import MobileOptimizedHome from './pages/Home/MobileOptimizedHome';
import './index.css';

function App() {
  return (
    <Router>
      <div className="App">
        <MobileOptimizedHome />
      </div>
    </Router>
  );
}

export default App;