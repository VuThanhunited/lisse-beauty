import React, { useEffect, useRef, useState } from 'react';
import TimelineItem from '../TimelineItem/TimelineItem';
import styles from './TimelineSection.module.css';

const TimelineSection = ({ timelineData }) => {
  const [visibleItems, setVisibleItems] = useState(() => {
    // Initialize all items as not visible for animation effect
    const initial = {};
    timelineData.forEach((_, index) => {
      initial[index] = false;
    });
    return initial;
  });
  const timelineRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!timelineRef.current) return;

      // Check visibility of each timeline item with enhanced animation trigger
      const items = timelineRef.current.querySelectorAll('[data-timeline-item]');
      const newVisibleItems = {};
      const windowHeight = window.innerHeight;

      items.forEach((item, index) => {
        const rect = item.getBoundingClientRect();
        // Trigger animation when item is 70% visible from bottom
        const isVisible =
          rect.top <= windowHeight * 0.7 && rect.bottom >= windowHeight * 0.1;

        if (isVisible && !visibleItems[index]) {
          newVisibleItems[index] = true;
        }
      });

      // Only update if there are new visible items
      if (Object.keys(newVisibleItems).length > 0) {
        setVisibleItems((prev) => ({ ...prev, ...newVisibleItems }));
      }

      // Calculate timeline progress
      const timelineContainer = timelineRef.current;
      const timelineRect = timelineContainer.getBoundingClientRect();
      const timelineTop = timelineRect.top;
      const timelineHeight = timelineRect.height;
      const windowCenter = windowHeight / 2;

      let progress = 0;
      if (timelineTop <= windowCenter) {
        const scrolledPast = Math.max(0, windowCenter - timelineTop);
        const totalScrollable = timelineHeight + windowHeight;
        progress = Math.min(1, scrolledPast / totalScrollable);
      }

      // Update progress line height
      const progressLine = document.querySelector(`.${styles.timelineProgress}`);
      if (progressLine) {
        const progressHeight = progress * timelineHeight;
        progressLine.style.height = `${progressHeight}px`;
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [visibleItems]);

  return (
    <section className={styles.timelineSection}>
      <div className={styles.container}>
        <div className={styles.timelineHeader}>
          <h2 className={styles.timelineTitle}>Lịch sử hình thành</h2>
          <div className={styles.titleUnderline} />
        </div>

        <div className={styles.timelineContainer} ref={timelineRef}>
          <div className={styles.timelineLine} />
          <div className={styles.timelineProgress} />

          {timelineData.map((item, index) => (
            <TimelineItem
              key={item.id}
              item={item}
              index={index}
              isVisible={visibleItems[index]}
              isLeft={index % 2 === 0}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TimelineSection;