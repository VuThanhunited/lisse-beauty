import React from 'react';
import ServiceCard from '../ServiceCard/ServiceCard';
import styles from './ServicesGrid.module.css';

const ServicesGrid = ({ services, onScrollToTop }) => {
  return (
    <div className={styles.servicesSection}>
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <h2>Tất cả các dịch vụ của chính tôi</h2>
          <button
            className={styles.scrollToTopBtn}
            onClick={onScrollToTop}
            aria-label="Lên đầu trang"
          >
            <span className={styles.arrowIcon}>↗</span>
          </button>
          <div className={styles.sectionUnderline}></div>
        </div>
        
        <div className={styles.serviceGrid}>
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServicesGrid;