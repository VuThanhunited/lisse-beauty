import React, { useCallback } from 'react';
import styles from './FeedbackHeader.module.css';

const FeedbackHeader = () => {
  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div className={styles.feedbackHeader}>
      <div className={styles.headerRow}>
        <div className={styles.titleSection}>
          <h2 className={styles.feedbackTitle}>Feedback khách hàng</h2>
          <div className={styles.titleUnderline} />
        </div>
        
        <button
          className={styles.scrollToTopBtn}
          onClick={scrollToTop}
          aria-label="Lên đầu trang"
        >
          <div className={styles.iconWrapper}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="7" y1="17" x2="17" y2="7"></line>
              <polyline points="7,7 17,7 17,17"></polyline>
            </svg>
          </div>
          <div className={styles.buttonRipple} />
        </button>
      </div>
      
      <p className={styles.feedbackSubtitle}>
        Chúng tôi đạt đánh giá từ khách hàng – <strong>4.9</strong> trên <strong>5</strong>
      </p>
      
      {/* Decorative elements */}
      <div className={styles.decorativeElement1} />
      <div className={styles.decorativeElement2} />
    </div>
  );
};

export default FeedbackHeader;