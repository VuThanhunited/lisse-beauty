import React from 'react';
import StarRating from '../StarRating/StarRating';
import styles from './FeedbackCard.module.css';

const FeedbackCard = ({ feedback, width, isActive }) => {
  const isVideo = feedback.type === 'video';
  
  return (
    <div 
      className={`${styles.feedbackCard} ${isActive ? styles.active : ''} ${isVideo ? styles.videoCard : ''}`}
      style={{ width: `${width}px`, minWidth: `${width}px` }}
    >
      <div
        className={styles.cardBackground}
        style={{
          backgroundImage: `url(${feedback.avatar})`,
        }}
      />
      
      <div className={styles.cardOverlay} />
      
      {isVideo ? (
        <div className={styles.videoPlayButton}>
          <div className={styles.playIconWrapper}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </div>
        </div>
      ) : (
        <div className={styles.cardContent}>
          <div className={styles.starsContainer}>
            <StarRating rating={feedback.rating} size="small" />
          </div>
          
          <div className={styles.textContent}>
            <h4 className={styles.customerName}>{feedback.customerName}</h4>
            <p className={styles.comment}>{feedback.comment}</p>
          </div>
          
          <div className={styles.metadata}>
            <span className={styles.date}>{feedback.date}</span>
            <span className={styles.service}>Dịch vụ {feedback.service}</span>
          </div>
        </div>
      )}
      
      {/* Floating elements for visual interest */}
      <div className={styles.floatingElement} />
      <div className={styles.floatingElement2} />
    </div>
  );
};

export default FeedbackCard;