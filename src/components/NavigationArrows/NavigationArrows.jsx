import React from 'react';
import styles from './NavigationArrows.module.css';

const NavigationArrows = ({ onPrev, onNext, position }) => {
  if (position === 'left') {
    return (
      <button
        className={`${styles.navArrow} ${styles.navArrowLeft}`}
        onClick={onPrev}
        aria-label="Feedback trước"
      >
        <div className={styles.arrowIcon}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15,18 9,12 15,6"></polyline>
          </svg>
        </div>
        <div className={styles.ripple} />
      </button>
    );
  }

  return (
    <button
      className={`${styles.navArrow} ${styles.navArrowRight}`}
      onClick={onNext}
      aria-label="Feedback tiếp theo"
    >
      <div className={styles.arrowIcon}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="9,18 15,12 9,6"></polyline>
        </svg>
      </div>
      <div className={styles.ripple} />
    </button>
  );
};

export default NavigationArrows;