import React, { useState, useEffect, useCallback } from 'react';
import FeedbackCard from '../FeedbackCard/FeedbackCard';
import NavigationArrows from '../NavigationArrows/NavigationArrows';
import FeedbackHeader from '../FeedbackHeader/FeedbackHeader';
import styles from './FeedbackSection.module.css';

const FeedbackSection = ({ feedbacks }) => {
  const [currentSlide, setCurrentSlide] = useState(1);
  const [cardWidth, setCardWidth] = useState(320);
  const [gap, setGap] = useState(30);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  
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

  // Responsive card width and gap
  useEffect(() => {
    const updateCardWidth = () => {
      if (window.innerWidth <= 480) {
        setCardWidth(Math.min(window.innerWidth - 80, 280));
        setGap(15);
      } else if (window.innerWidth <= 768) {
        setCardWidth(300);
        setGap(20);
      } else if (window.innerWidth <= 1024) {
        setCardWidth(320);
        setGap(25);
      } else {
        setCardWidth(350);
        setGap(30);
      }
    };

    updateCardWidth();
    window.addEventListener("resize", updateCardWidth);
    return () => window.removeEventListener("resize", updateCardWidth);
  }, []);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(interval);
  }, [nextSlide, isAutoPlaying]);

  // Pause auto-play on hover
  const handleMouseEnter = () => setIsAutoPlaying(false);
  const handleMouseLeave = () => setIsAutoPlaying(true);

  // Create extended array with clones for seamless loop
  const extendedFeedbacks = [
    feedbacks[feedbacks.length - 1], // Clone of last
    ...feedbacks,
    feedbacks[0] // Clone of first
  ];

  return (
    <section className={styles.feedbackSection}>
      <div className={styles.container}>
        <FeedbackHeader />
        
        <div 
          className={styles.feedbackSlideshow}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <NavigationArrows 
            onPrev={prevSlide}
            onNext={nextSlide}
            position="left"
          />

          <div className={styles.feedbackContainer}>
            <div
              className={styles.feedbackTrack}
              style={{
                transform: `translateX(-${currentSlide * (cardWidth + gap)}px)`,
                transition: isTransitioning
                  ? "transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)"
                  : "none",
              }}
              onTransitionEnd={handleTransitionEnd}
            >
              {extendedFeedbacks.map((feedback, index) => (
                <FeedbackCard
                  key={`${feedback.id}-${index}`}
                  feedback={feedback}
                  width={cardWidth}
                  isActive={index === currentSlide}
                />
              ))}
            </div>
          </div>

          <NavigationArrows 
            onPrev={prevSlide}
            onNext={nextSlide}
            position="right"
          />
        </div>

        {/* Progress indicators */}
        <div className={styles.progressIndicators}>
          {feedbacks.map((_, index) => (
            <button
              key={index}
              className={`${styles.progressDot} ${
                index === (currentSlide - 1 + totalCards) % totalCards ? styles.active : ''
              }`}
              onClick={() => setCurrentSlide(index + 1)}
              aria-label={`Đến feedback ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeedbackSection;