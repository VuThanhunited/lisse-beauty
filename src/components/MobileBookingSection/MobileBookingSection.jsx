import React, { useState } from 'react';
import styles from './MobileBookingSection.module.css';
import facility1 from '../../data/cơ sở vật chất-1.jpg';

const MobileBookingSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    service: '',
    location: ''
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
    console.log('Booking form submitted:', formData);
    // Handle form submission logic here
  };

  return (
    <div className={styles.bookingSection}>
      <div className={styles.container}>
        <div className={styles.bookingContent}>
          {/* Image Section */}
          <div className={styles.imageSection}>
            <img
              src={facility1}
              alt="Chuyên gia tư vấn - KIMLY Beauty"
              className={styles.bookingImage}
            />
            <div className={styles.imageOverlay}>
              <div className={styles.overlayContent}>
                <h3 className={styles.overlayTitle}>Chuyên gia tư vấn</h3>
                <p className={styles.overlayText}>
                  Đội ngũ chuyên gia giàu kinh nghiệm sẵn sàng tư vấn cho bạn
                </p>
              </div>
            </div>
          </div>

          {/* Form Section */}
          <div className={styles.formSection}>
            <div className={styles.formHeader}>
              <h2 className={styles.formTitle}>Đặt lịch ngay!</h2>
              <p className={styles.formSubtitle}>
                Để lại thông tin để được tư vấn miễn phí
              </p>
            </div>

            <form onSubmit={handleSubmit} className={styles.bookingForm}>
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
                <input
                  type="email"
                  name="email"
                  placeholder="Email của bạn"
                  className={styles.formInput}
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <select
                    name="service"
                    className={styles.formInput}
                    value={formData.service}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Chọn dịch vụ</option>
                    <option value="glowing-brow">Glowing Brow</option>
                    <option value="hairstroke">Hair Stroke</option>
                    <option value="sketchlips">Sketch Lips</option>
                    <option value="beauty-care">Beauty Care</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <select
                    name="location"
                    className={styles.formInput}
                    value={formData.location}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Chọn cơ sở gần bạn</option>
                    <option value="hcm-1">343 Nguyễn Khang - Hà Nội</option>
                    <option value="hcm-2">146 Trung Phụng - Hà Nội</option>
                    <option value="hanoi-1">137 Lê Thị Riêng - TP.HCM</option>
                    <option value="danang-1">58 Lê Thị Riêng - TP.HCM</option>
                    <option value="other">Khu đô thị Vạn Phúc</option>
                  </select>
                </div>
              </div>

              <button type="submit" className={styles.submitButton}>
                ĐẶT LỊCH ĐỂ ĐƯỢC TƯ VẤN NGAY →
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileBookingSection;