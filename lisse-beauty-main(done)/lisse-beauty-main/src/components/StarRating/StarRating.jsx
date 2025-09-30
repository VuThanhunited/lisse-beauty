import React from 'react';
import styles from './StarRating.module.css';

const StarRating = ({ rating = 5, size = 'medium' }) => {
  const stars = Array.from({ length: 5 }, (_, index) => (
    <span
      key={index}
      className={`${styles.star} ${styles[size]} ${
        index < rating ? styles.filled : styles.empty
      }`}
    >
      {index < rating ? (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      )}
    </span>
  ));

  return <div className={styles.starRating}>{stars}</div>;
};

export default StarRating;