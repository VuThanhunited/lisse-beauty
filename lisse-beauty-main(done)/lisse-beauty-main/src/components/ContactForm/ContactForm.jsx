import React, { useState } from 'react';
import styles from './ContactForm.module.css';

const ContactForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    message: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(formData);
    }
    console.log('Form submitted:', formData);
  };

  return (
    <div className={styles.contactForm}>
      <h2 className={styles.formTitle}>Bạn đang thắc mắc điều gì?</h2>
      <p className={styles.formSubtitle}>Hãy để chúng mình tư vấn cho bạn</p>

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <input
            type="text"
            name="name"
            placeholder="Nhập tên của bạn"
            className={styles.formInput}
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <input
            type="tel"
            name="phone"
            placeholder="Số điện thoại"
            className={styles.formInput}
            value={formData.phone}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <textarea
            name="message"
            placeholder="Để lại lời nhắn"
            rows="6"
            className={styles.formTextarea}
            value={formData.message}
            onChange={handleInputChange}
            required
          ></textarea>
        </div>

        <button type="submit" className={styles.submitButton}>
          ĐẶT LỊCH ĐỂ ĐƯỢC TƯ VẤN NGAY →
        </button>
      </form>
    </div>
  );
};

export default ContactForm;