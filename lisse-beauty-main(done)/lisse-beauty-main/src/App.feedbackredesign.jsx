import React from 'react';
import FeedbackSection from './components/FeedbackSection/FeedbackSection';
import { mockRootProps } from './servicesMockData';
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
            Kimly Beauty Spa
          </h1>
          <p style={{ 
            fontSize: '1.2rem',
            color: 'var(--text)',
            marginBottom: '40px'
          }}>
            Redesigned Feedback Section with Modern Animations
          </p>
        </div>
      </div>
      
      <FeedbackSection feedbacks={mockRootProps.feedbacks} />
      
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
          Modern feedback carousel with glassmorphism design, smooth animations, 
          and improved user experience. Features auto-play, hover controls, 
          and responsive design.
        </p>
      </div>
    </div>
  );
}

export default App;