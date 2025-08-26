import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import styles from "./Services.module.css";
import RightSidebar from "../../components/RightSidebar/RightSidebar";
import FeedbackContent from "../../components/Feedback/Feedback";
import axios from "axios";
// Import images
import glowingBrowImg from "../../data/518600115_122120764574891459_5021028668652265494_n.jpg";
import hairstrokeImg from "../../data/519421760_122120777714891459_5490134016365387672_n.jpg";

const Service = () => {
  const [services, setServices] = useState([]);
  const navigate = useNavigate();
  const headers = useMemo(
    () => ({ Authorization: "TOKEN 2AuVTwbx241MuVxjqnlzUh73SEBPtuzk" }),
    []
  );

  // Fetch services
  useEffect(() => {
    const fetchServiceData = async () => {
      try {
        const response = await axios.get(
          "https://api.baserow.io/api/database/rows/table/639961/?user_field_names=true",
          { headers }
        );
        setServices(response.data.results || []);
      } catch (error) {
        console.error("Error fetching service data:", error);
      }
    };
    fetchServiceData();
  }, [headers]);

  const handleGlowingBrowClick = () => {
    navigate("/beauty-knowledge/glowing-brow");
  };

  const handleHairstrokeClick = () => {
    navigate("/beauty-knowledge/hairstroke");
  };
  return (
    <div className={styles.servicePage}>
      <Navbar />
      <RightSidebar />

      {/* Banner Section */}
      <div className={styles.bannerSection}></div>

      {/* Main Content */}
      <div className={styles.mainContent}>
        <div className={styles.container}>
          {/* Service Section */}
          <div className={styles.serviceSection}>
            <div className={styles.sectionHeader}>
              <h2>Tất cả các dịch vụ của chúng tôi</h2>
              <div className={styles.sectionUnderline}></div>
              <button
                className={styles.scrollToTopBtn}
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              >
                <span className={styles.arrowIcon}>↗</span>
              </button>
            </div>

            <div className={styles.serviceGrid}>
              {/* Glowing Brow Card */}
              <div className={styles.serviceCard}>
                <div className={styles.cardImage}>
                  <img src={glowingBrowImg} alt="Glowing Brow" />
                  <button className={styles.navArrowLeft}>
                    <span>‹</span>
                  </button>
                </div>
                <div className={styles.cardContent}>
                  <h3>Glowing Brow</h3>
                  <p>
                    Glowing Brow là gì? Giải pháp chăn máy tự nhiên, nhẹ nhàng,
                    sắc nét không lo dậu phần xăm Ban...
                  </p>
                  <button
                    className={styles.detailButton}
                    onClick={handleGlowingBrowClick}
                  >
                    Xem chi tiết
                    <span className={styles.arrow}>→</span>
                  </button>
                </div>
              </div>

              {/* Hairstroke Card */}
              <div className={styles.serviceCard}>
                <div className={styles.cardImage}>
                  <img src={hairstrokeImg} alt="Hairstroke" />
                </div>
                <div className={styles.cardContent}>
                  <h3>Hairstroke</h3>
                  <p>
                    Tạo sợi Hairstroke - Công nghệ chăn máy tự nhiên như thật
                    Tạo sợi Hairstroke là kỹ thuật làm đẹp...
                  </p>
                  <button
                    className={styles.detailButton}
                    onClick={handleHairstrokeClick}
                  >
                    Xem chi tiết
                    <span className={styles.arrow}>→</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <FeedbackContent />
      <Footer />
    </div>
  );
};

export default Service;
