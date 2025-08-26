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
      ⭐
    </span>
  ));

  return <div className={styles.starRating}>{stars}</div>;
};

export default StarRating;