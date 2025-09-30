import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Services from './pages/Services/Services';
import './index.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Services />
      </div>
    </Router>
  );
}

export default App;