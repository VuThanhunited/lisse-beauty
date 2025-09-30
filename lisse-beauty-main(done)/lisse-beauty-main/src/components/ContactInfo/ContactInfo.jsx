import React from 'react';
import styles from './ContactInfo.module.css';

const ContactInfo = ({ phone, email, workingHours, socialLinks }) => {
  return (
    <div className={styles.contactInfo}>
      <h2 className={styles.title}>Thông tin liên hệ</h2>
      
      <div className={styles.infoList}>
        <div className={styles.infoItem}>
          <div className={styles.iconWrapper}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
            </svg>
          </div>
          <span className={styles.infoText}>{phone}</span>
        </div>

        <div className={styles.infoItem}>
          <div className={styles.iconWrapper}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
            </svg>
          </div>
          <span className={styles.infoText}>{email}</span>
        </div>

        <div className={styles.infoItem}>
          <div className={styles.iconWrapper}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/>
              <path d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
            </svg>
          </div>
          <div className={styles.workingHours}>
            <div className={styles.workingTitle}>Thời gian làm việc</div>
            <div className={styles.infoText}>{workingHours}</div>
          </div>
        </div>
      </div>

      <div className={styles.socialSection}>
        <h3 className={styles.socialTitle}>Theo dõi chúng tôi tại</h3>
        <div className={styles.socialLinks}>
          {socialLinks.map((link, index) => (
            <a key={index} href={link.url} className={styles.socialLink} aria-label={link.label}>
              {link.icon}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContactInfo;