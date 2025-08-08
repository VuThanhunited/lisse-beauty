import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import styles from "./Services.module.css";

// Import images
import bannerImg from "../../data/banner.jpg";
import glowingBrowImg from "../../data/518600115_122120764574891459_5021028668652265494_n.jpg";
import hairstrokeImg from "../../data/519421760_122120777714891459_5490134016365387672_n.jpg";
import customerImg1 from "../../data/520240366_122120843918891459_7638784159492956398_n.jpg";
import customerImg2 from "../../data/520382423_122120854712891459_6189393590492377467_n.jpg";
import customerImg3 from "../../data/523400147_122123835236891459_4245426327108376588_n.jpg";

const Services = () => {
  const navigate = useNavigate();

  const handleGlowingBrowClick = () => {
    navigate("/beauty-knowledge/glowing-brow");
  };

  const handleHairstrokeClick = () => {
    navigate("/beauty-knowledge/hairstroke");
  };

  return (
    <div className={styles.servicesPage}>
      <Navbar />

      {/* Banner Section */}
      <div className={styles.bannerSection}>
        <div className={styles.bannerImageWrapper}>
          <img src={bannerImg} alt="Dịch vụ" className={styles.bannerImage} />
          <div className={styles.bannerOverlay}>
            <h1>Dịch vụ</h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={styles.mainContent}>
        <div className={styles.container}>
          {/* Services Section */}
          <div className={styles.servicesSection}>
            <h2 className={styles.sectionTitle}>
              Tất cả các dịch vụ của chính tôi
            </h2>

            <div className={styles.servicesGrid}>
              {/* Glowing Brow Service */}
              <div className={styles.serviceCard}>
                <div className={styles.serviceImage}>
                  <img src={glowingBrowImg} alt="Glowing Brow" />
                </div>
                <div className={styles.serviceContent}>
                  <h3>Glowing Brow</h3>
                  <p>
                    Glowing Brow là gì? Giải pháp chăm máy tự nhiên, nhẹ nhàng,
                    các nét không tô đậu phần xăm Bōn...
                  </p>
                  <button
                    className={styles.detailButton}
                    onClick={handleGlowingBrowClick}
                  >
                    Xem chi tiết →
                  </button>
                </div>
              </div>

              {/* Hairstroke Service */}
              <div className={styles.serviceCard}>
                <div className={styles.serviceImage}>
                  <img src={hairstrokeImg} alt="Hairstroke" />
                </div>
                <div className={styles.serviceContent}>
                  <h3>Hairstroke</h3>
                  <p>
                    Tạo sợi Hairstroke - Công nghệ chăm máy tự nhiên như thật
                    Tạo sợi Hairstroke là kỹ thuật làm đẹp...
                  </p>
                  <button
                    className={styles.detailButton}
                    onClick={handleHairstrokeClick}
                  >
                    Xem chi tiết →
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Feedback Section */}
          <div className={styles.feedbackSection}>
            <h2 className={styles.feedbackTitle}>Feedback khách hàng</h2>
            <p className={styles.feedbackSubtitle}>
              Chúng tôi đạt đánh giá từ khách hàng - 4.9 - trên 5
            </p>

            <div className={styles.feedbackContainer}>
              {/* Feedback Card 1 */}
              <div className={styles.feedbackCard}>
                <div className={styles.feedbackStars}>
                  <span>⭐⭐⭐⭐⭐</span>
                </div>
                <div className={styles.feedbackContent}>
                  <h4>Nguyễn Thúy Tiên</h4>
                  <p>
                    Dịch vụ tốt, chế độ làm không đau, không bị xưng, màu mới
                    chi thoa làm cho em rất là vừng ý, tuyệt vời á
                  </p>
                  <div className={styles.feedbackMeta}>
                    <span>4 - Tháng 5</span>
                    <span>Sử dụng dịch vụ Hairstroke</span>
                  </div>
                </div>
                <div className={styles.feedbackImage}>
                  <img src={customerImg1} alt="Nguyễn Thúy Tiên" />
                </div>
              </div>

              {/* Feedback Card 2 */}
              <div className={styles.feedbackCard}>
                <div className={styles.feedbackStars}>
                  <span>⭐⭐⭐⭐⭐</span>
                </div>
                <div className={styles.feedbackContent}>
                  <h4>Nguyễn Thúy Tiên</h4>
                  <p>
                    Dịch vụ tốt, chế độ làm không đau, không bị xưng, màu mới
                    chi thoa làm cho em rất là vừng ý, tuyệt vời á
                  </p>
                  <div className={styles.feedbackMeta}>
                    <span>5 - Tháng 6</span>
                    <span>Sử dụng dịch vụ Hairstroke</span>
                  </div>
                </div>
                <div className={styles.feedbackImage}>
                  <img src={customerImg2} alt="Nguyễn Thúy Tiên" />
                </div>
              </div>

              {/* Feedback Card 3 */}
              <div className={styles.feedbackCard}>
                <div className={styles.feedbackStars}>
                  <span>⭐⭐⭐⭐⭐</span>
                </div>
                <div className={styles.feedbackContent}>
                  <h4>Nguyễn Thúy Tiên</h4>
                  <p>
                    Dịch vụ tốt, chế độ làm không đau, không bị xưng, màu mới
                    chi thoa làm cho em rất là vừng ý, tuyệt vời á
                  </p>
                  <div className={styles.feedbackMeta}>
                    <span>6 - Tháng 7</span>
                    <span>Sử dụng dịch vụ Hairstroke</span>
                  </div>
                </div>
                <div className={styles.feedbackImage}>
                  <img src={customerImg3} alt="Nguyễn Thúy Tiên" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Services;
