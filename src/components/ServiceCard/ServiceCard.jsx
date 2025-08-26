import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ServiceCard.module.css';

const ServiceCard = ({ service }) => {
  const navigate = useNavigate();

  const handleDetailClick = () => {
    navigate(service.detailUrl);
  };

  return (
    <div className={styles.serviceCard}>
      <div className={styles.cardImage}>
        <img 
          src={service.image} 
          alt={`${service.name} - Reece van der Merwe on Unsplash`}
          style={{ width: '100%', height: '100%' }}
        />
      </div>
      <div className={styles.cardContent}>
        <h3>{service.name}</h3>
        <p>{service.description}</p>
        <button
          className={styles.detailButton}
          onClick={handleDetailClick}
        >
          Xem chi tiết
          <span className={styles.arrow}>→</span>
        </button>
      </div>
    </div>
  );
};

export default ServiceCard;