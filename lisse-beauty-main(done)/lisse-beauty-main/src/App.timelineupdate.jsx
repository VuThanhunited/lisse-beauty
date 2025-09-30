import React from 'react';
import TimelineSection from './components/TimelineSection/TimelineSection';
import { timelineMockData } from './data/timelineMockData';

function App() {
  return (
    <div style={{ 
      minHeight: '100vh',
      background: '#f0f4f0',
      padding: '20px 0'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 20px'
      }}>
        <h1 style={{
          textAlign: 'center',
          fontFamily: '"Playfair Display", serif',
          fontSize: '2.5rem',
          color: '#2c2c2c',
          marginBottom: '40px'
        }}>
          KIMLY Beauty Timeline - Updated Layout
        </h1>
        <TimelineSection timelineData={timelineMockData} />
      </div>
    </div>
  );
}

export default App;