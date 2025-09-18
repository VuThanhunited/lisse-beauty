import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Contact from './pages/Contact/Contact';
import './index.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Contact />
      </div>
    </Router>
  );
}

export default App;