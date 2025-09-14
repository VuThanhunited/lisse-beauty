import React from 'react';
import styles from './TimelineItem.module.css';

const TimelineItem = ({ item, index, isVisible, isLeft }) => {
  return (
    <div 
      className={`${styles.timelineItem} ${isLeft ? styles.left : styles.right} ${
        isVisible ? styles.visible : ''
      }`}
      data-timeline-item
    >
      {/* Timeline Dot */}
      <div className={styles.timelineDot}>
        <div className={styles.dotInner} />
      </div>

      {/* Year Badge - positioned on opposite side */}
      <div className={styles.yearBadge}>
        <span className={styles.yearText}>{item.year}</span>
      </div>

      {/* Content Container */}
      <div className={styles.contentContainer}>
        {/* Image Container */}
        <div className={styles.imageContainer}>
          <img
            src={item.image}
            alt={`${item.title} - ${item.photographer || 'Timeline image'}`}
            className={styles.timelineImage}
          />
        </div>

        {/* Text Content */}
        <div className={styles.textContent}>
          <h3 className={styles.itemTitle}>{item.title}</h3>
          <p className={styles.itemDescription}>{item.description}</p>
        </div>
      </div>
    </div>
  );
};

export default TimelineItem;