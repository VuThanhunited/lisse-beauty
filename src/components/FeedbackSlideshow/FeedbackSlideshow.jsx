import React, { useState, useEffect, useCallback } from 'react';
import StarRating from '../StarRating/StarRating';
import styles from './FeedbackSlideshow.module.css';

const FeedbackSlideshow = ({ feedbacks }) => {
  const [currentSlide, setCurrentSlide] = useState(1);
  const [cardWidth, setCardWidth] = useState(320);
  const [gap, setGap] = useState(30);
  const [isTransitioning, setIsTransitioning] = useState(true);
  
  const totalCards = feedbacks.length;

  const nextSlide = useCallback(() => {
    if (!isTransitioning) return;
    setCurrentSlide((prev) => prev + 1);
  }, [isTransitioning]);

  const prevSlide = useCallback(() => {
    if (!isTransitioning) return;
    setCurrentSlide((prev) => prev - 1);
  }, [isTransitioning]);

  const handleTransitionEnd = useCallback(() => {
    setIsTransitioning(false);
    
    if (currentSlide >= totalCards + 1) {
      setCurrentSlide(1);
    } else if (currentSlide <= 0) {
      setCurrentSlide(totalCards);
    }
    
    setTimeout(() => setIsTransitioning(true), 50);
  }, [currentSlide, totalCards]);

  useEffect(() => {
    const updateCardWidth = () => {
      if (window.innerWidth <= 480) {
        setCardWidth(window.innerWidth - 80);
        setGap(15);
      } else if (window.innerWidth <= 768) {
        setCardWidth(280);
        setGap(20);
      } else if (window.innerWidth <= 1024) {
        setCardWidth(300);
        setGap(25);
      } else {
        setCardWidth(320);
        setGap(30);
      }
    };

    updateCardWidth();
    window.addEventListener("resize", updateCardWidth);
    return () => window.removeEventListener("resize", updateCardWidth);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 4000);

    return () => clearInterval(interval);
  }, [nextSlide]);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Create extended array with clones for seamless loop
  const extendedFeedbacks = [
    feedbacks[feedbacks.length - 1], // Clone of last
    ...feedbacks,
    feedbacks[0] // Clone of first
  ];

  return (
    <div className={styles.feedbackSection}>
      <div className={styles.container}>
        <div className={styles.feedbackHeader}>
          <div className={styles.headerRow}>
            <div className={styles.titleSection}>
              <h2 className={styles.feedbackTitle}>Feedback khách hàng</h2>
            </div>
            <button
              className={styles.scrollToTopBtn}
              aria-label="Lên đầu trang"
              onClick={scrollToTop}
            >
              <span className={styles.arrowIcon}>↗</span>
            </button>
          </div>
          <div className={styles.sectionUnderline}></div>
          <p className={styles.feedbackSubtitle}>
            Chúng tôi đạt đánh giá từ khách hàng – <strong>4.9</strong> trên{" "}
            <strong>5</strong>
          </p>
        </div>

        <div className={styles.feedbackSlideshow}>
          <button
            className={`${styles.feedbackArrow} ${styles.feedbackArrowLeft}`}
            aria-label="Feedback trước"
            onClick={prevSlide}
          >
            ❮
          </button>

          <div className={styles.feedbackContainer}>
            <div
              className={styles.feedbackTrack}
              style={{
                transform: `translateX(-${
                  currentSlide * (cardWidth + gap)
                }px)`,
                transition: isTransitioning
                  ? "transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)"
                  : "none",
              }}
              onTransitionEnd={handleTransitionEnd}
            >
              {extendedFeedbacks.map((feedback, index) => (
                <div key={`${feedback.id}-${index}`} className={styles.feedbackCard}>
                  <div
                    className={styles.feedbackCardBg}
                    style={{
                      backgroundImage: `url(${feedback.avatar})`,
                    }}
                  ></div>
                  <div className={styles.feedbackCardOverlay}>
                    <div className={styles.feedbackStars}>
                      <StarRating rating={feedback.rating} size="small" />
                    </div>
                    <div className={styles.feedbackContent}>
                      <h4 className={styles.feedbackName}>{feedback.customerName}</h4>
                      <p className={styles.feedbackComment}>{feedback.comment}</p>
                      <div className={styles.feedbackMeta}>
                        <span className={styles.feedbackDate}>{feedback.date}</span>
                        <span className={styles.feedbackService}>
                          Sử dụng dịch vụ {feedback.service}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            className={`${styles.feedbackArrow} ${styles.feedbackArrowRight}`}
            aria-label="Feedback tiếp theo"
            onClick={nextSlide}
          >
            ❯
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeedbackSlideshow;