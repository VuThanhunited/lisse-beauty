import React from 'react';
import TimelineSection from './components/TimelineSection/TimelineSection';
import { timelineMockData } from './data/timelineMockData';
import './index.css';

function App() {
  return (
    <div className="App">
      <div style={{ padding: '40px 0', background: '#ffffff' }}>
        <div style={{ 
          maxWidth: '1200px', 
          margin: '0 auto', 
          padding: '0 20px',
          textAlign: 'center'
        }}>
          <h1 style={{ 
            fontFamily: '"Playfair Display", serif',
            fontSize: '3rem',
            color: 'var(--heading)',
            marginBottom: '20px'
          }}>
            Kimly Beauty Timeline
          </h1>
          <p style={{ 
            fontSize: '1.2rem',
            color: 'var(--text)',
            marginBottom: '40px'
          }}>
            Modern Timeline Component with Glassmorphism Design
          </p>
        </div>
      </div>
      
      <TimelineSection timelineData={timelineMockData} />
      
      <div style={{ 
        padding: '80px 0', 
        background: '#ffffff',
        textAlign: 'center'
      }}>
        <p style={{ 
          fontSize: '1.1rem',
          color: 'var(--text)',
          maxWidth: '600px',
          margin: '0 auto'
        }}>
          Enhanced timeline with modern glassmorphism design, smooth scroll animations, 
          and responsive layout. Features floating elements and improved visual hierarchy.
        </p>
      </div>
    </div>
  );
}

export default App;