import React from 'react';
import styles from './GoogleMapsSection.module.css';

const GoogleMapsSection = ({ locations }) => {
  return (
    <div className={styles.mapsSection}>
      <div className={styles.container}>
        <h2 className={styles.sectionTitle}>Tìm kiếm chúng tôi trên Google Maps</h2>
        
        <div className={styles.locationTabs}>
          {locations.map((location, index) => (
            <button key={index} className={styles.locationTab}>
              {location.name}
            </button>
          ))}
        </div>

        <div className={styles.locationInfo}>
          <div className={styles.locationDetails}>
            <div className={styles.locationItem}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
              <span>343 Nguyễn Khang, Yên Hoà, Cầu Giấy, Hà Nội</span>
            </div>
            <div className={styles.locationItem}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
              </svg>
              <span>0886 357 357</span>
            </div>
          </div>
        </div>

        <div className={styles.mapContainer}>
          <iframe 
            src="https://maps.google.com/maps?width=100%25&height=400&hl=en&q=343%20Nguy%E1%BB%85n%20Khang,%20Y%C3%AAn%20Ho%C3%A0,%20C%E1%BA%A7u%20Gi%E1%BA%A5y,%20H%C3%A0%20N%E1%BB%99i&t=&z=14&ie=UTF8&iwloc=B&output=embed" 
            width="100%" 
            height="400" 
            style={{border: 0, borderRadius: '20px'}}
            allowFullScreen={true}
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            title="KIMLY Beauty Location"
          />
        </div>
      </div>
    </div>
  );
};

export default GoogleMapsSection;