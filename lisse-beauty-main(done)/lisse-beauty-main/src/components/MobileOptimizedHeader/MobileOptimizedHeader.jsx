import { useState, useEffect, useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import styles from "./MobileOptimizedHeader.module.css";

const MobileOptimizedHeader = () => {
  const [bannerUrl, setBannerUrl] = useState("");
  const [formData, setFormData] = useState({
    name: '',
    phone: ''
  });

  const headers = useMemo(
    () => ({
      Authorization: "TOKEN 2AuVTwbx241MuVxjqnlzUh73SEBPtuzk",
    }),
    []
  );

  useEffect(() => {
    const fetchBannerData = async () => {
      try {
        const response = await axios.get(
          "https://api.baserow.io/api/database/rows/table/639961/?user_field_names=true",
          { headers }
        );
        setBannerUrl(response.data.results[0]?.banner[0]?.url || "");
      } catch (error) {
        console.error("Error fetching banner data:", error);
      }
    };
    fetchBannerData();
  }, [headers]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  return (
    <header className={styles.header}>
      {/* Background Image */}
      <div
        className={styles.backgroundImage}
        style={{ backgroundImage: `url(${bannerUrl})` }}
      >
        <div className={styles.overlay}></div>
      </div>

      {/* Main Content */}
      <div className={styles.heroContent}>
        <div className={styles.heroText}>
          <h1 className={styles.heroTitle}>
            Vẻ đẹp tự nhiên
            <span className={styles.titleAccent}>từ chính bạn</span>
          </h1>
          <p className={styles.heroSubtitle}>
            Khám phá dịch vụ làm đẹp chuyên nghiệp với công nghệ hiện đại
          </p>
        </div>
      </div>

      {/* Bottom Cards Section - Mobile Optimized */}
      <div className={styles.bottomSection}>
        <div className={styles.cardsContainer}>
          {/* Booking Form - Mobile First */}
          <div className={styles.bookingCard}>
            <h3 className={styles.cardTitle}>Bạn thắc mắc điều gì?</h3>
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formGroup}>
                <input
                  type="text"
                  name="name"
                  placeholder="Nhập tên của bạn"
                  className={styles.formInput}
                  value={formData.name}
                  onChange={handleInputChange}
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
                />
              </div>
              <button type="submit" className={styles.submitBtn}>
                TƯ VẤN LÀM ĐẸP →
              </button>
            </form>
          </div>

          {/* Service Info Card - Mobile Optimized */}
          <div className={styles.serviceCard}>
            <h4 className={styles.serviceTitle}>Đánh giá dịch vụ</h4>
            <p className={styles.serviceDesc}>
              Chúng tôi muốn nghe từ bạn nhiều hơn để có thể hiển thị dịch vụ tốt nhất
            </p>
            <div className={styles.serviceIcons}>
              <FontAwesomeIcon icon={faThumbsUp} />
              <FontAwesomeIcon icon={faThumbsUp} />
              <FontAwesomeIcon icon={faThumbsUp} />
            </div>
          </div>

          {/* Gentle Care Card - Mobile Optimized */}
          <div className={styles.gentleCard}>
            <div className={styles.gentleText}>
              <span className={styles.animatedText}>Nhẹ nhàng</span>
              <span className={styles.animatedText}>Tinh tế</span>
              <span className={styles.animatedText}>Tự nhiên</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default MobileOptimizedHeader;