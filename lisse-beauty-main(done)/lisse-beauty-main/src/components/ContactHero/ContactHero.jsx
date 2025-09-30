import React from 'react';
import styles from './ContactHero.module.css';

const ContactHero = ({ title = "Liên hệ" }) => {
  return (
    <div className={styles.heroSection}>
      <div className={styles.heroOverlay}>
        <h1 className={styles.heroTitle}>{title}</h1>
      </div>
    </div>
  );
};

export default ContactHero;