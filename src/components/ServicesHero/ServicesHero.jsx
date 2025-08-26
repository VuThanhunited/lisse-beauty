import React from 'react';
import styles from './ServicesHero.module.css';

const ServicesHero = ({ title = "Dịch vụ" }) => {
  return (
    <div className={styles.heroSection}>
      <div className={styles.heroOverlay}>
        <h1 className={styles.heroTitle}>{title}</h1>
      </div>
    </div>
  );
};

export default ServicesHero;