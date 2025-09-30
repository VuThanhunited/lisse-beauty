import React from 'react';
import TimelineSection from './components/TimelineSection/TimelineSection';
import { timelineMockData } from './data/timelineMockData';
import './index.css';

function App() {
  return (
    <div className="App">
      {/* Header Section */}
      <div style={{ 
        padding: '60px 0 40px 0', 
        background: 'linear-gradient(135deg, #f8fdf9 0%, #ffffff 100%)',
        textAlign: 'center'
      }}>
        <div style={{ 
          maxWidth: '1200px', 
          margin: '0 auto', 
          padding: '0 20px'
        }}>
          <h1 style={{ 
            fontFamily: '"Playfair Display", serif',
            fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
            color: 'var(--heading)',
            marginBottom: '16px',
            fontWeight: '400',
            letterSpacing: '-0.02em'
          }}>
            Câu chuyện thương hiệu
          </h1>
          <p style={{ 
            fontSize: '1.1rem',
            color: 'var(--text)',
            marginBottom: '0',
            opacity: '0.8',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            Hành trình phát triển của KIMLY Beauty từ những ngày đầu đến hiện tại
          </p>
        </div>
      </div>
      
      {/* Timeline Section */}
      <TimelineSection timelineData={timelineMockData} />
      
      {/* Footer Section */}
      <div style={{ 
        padding: '60px 0', 
        background: '#ffffff',
        textAlign: 'center',
        borderTop: '1px solid rgba(124, 152, 133, 0.1)'
      }}>
        <div style={{
          maxWidth: '800px',
          margin: '0 auto',
          padding: '0 20px'
        }}>
          <p style={{ 
            fontSize: '1rem',
            color: 'var(--text)',
            margin: '0',
            opacity: '0.7',
            lineHeight: '1.6'
          }}>
            Mỗi cột mốc trong lịch sử hình thành KIMLY Beauty đều thể hiện cam kết không ngừng 
            nâng cao chất lượng dịch vụ và mang đến trải nghiệm làm đẹp tốt nhất cho khách hàng.
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;