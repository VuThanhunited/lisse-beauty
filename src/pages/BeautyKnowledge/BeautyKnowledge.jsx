import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import styles from "./BeautyKnowledge.module.css";
import RightSidebar from "../../components/RightSidebar/RightSidebar";
import axios from "axios";
// Import images
import glowingBrowImg from "../../data/518600115_122120764574891459_5021028668652265494_n.jpg";
import hairstrokeImg from "../../data/519421760_122120777714891459_5490134016365387672_n.jpg";

const BeautyKnowledge = () => {
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
    <div className={styles.beautyKnowledgePage}>
      <Navbar />
      <RightSidebar />
      
      {/* Banner Section */}
      <div className={styles.bannerSection}>
      </div>

      {/* Main Content */}
      <div className={styles.mainContent}>
        <div className={styles.container}>
          {/* Trending Beauty Section */}
          <div className={styles.trendingSection}>
            <div className={styles.sectionHeader}>
              <h2>Xu hướng làm đẹp</h2>
              <div className={styles.sectionUnderline}></div>
              <button
                className={styles.scrollToTopBtn}
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              >
                <span className={styles.arrowIcon}>↗</span>
              </button>
            </div>

            <div className={styles.knowledgeGrid}>
              {/* Glowing Brow Card */}
              <div className={styles.knowledgeCard}>
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
              <div className={styles.knowledgeCard}>
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

          {/* phân tích kỹ thuật */}
          <div className={styles.trendingSection}>
            <div className={styles.sectionHeader}>
              <h2>Phân tích kỹ thuật</h2>
              <div className={styles.sectionUnderline}></div>
              <button
                className={styles.scrollToTopBtn}
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              >
                <span className={styles.arrowIcon}>↗</span>
              </button>
            </div>

            <div className={styles.knowledgeGrid}>
              {/* Glowing Brow Card */}
              <div className={styles.knowledgeCard}>
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
              <div className={styles.knowledgeCard}>
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

            {/* Câu chuyện khách hàng */}
            
          </div>


          <div className={styles.customerStoriesSection}>
        <h2 className={styles.storiesTitle}>Câu chuyện khách hàng</h2>
        <p className={styles.storiesSubtitle}>
          Cùng chúng tôi kể lên câu chuyện của chính mình
        </p>

        <div className={styles.storiesContainer}>
          {[0, 1, 2].map((idx) => (
            <div className={styles.storyCard} key={idx}>
              <div className={styles.storyImageWrapper}>
                <img
                  src={
                    services[0] &&
                    services[0].customerImg &&
                    services[0].customerImg[idx]
                      ? services[0].customerImg[idx].url
                      : ""
                  }
                  alt={`Câu chuyện khách hàng ${idx + 1}`}
                />
                <div className={styles.storyOverlay}>
                  <div className={styles.storyContent}>
                    {idx === 0 && (
                      <>
                        <h3>Mỗi sáng thức dậy không lo tìm thời gian</h3>
                        <p>
                          Chúng ta mất 15 phút mỗi sáng để kẻ lông mày, thật là
                          lãng phí
                        </p>
                      </>
                    )}
                    {idx === 1 && (
                      <>
                        <h3>Tự tin hơn mỗi ngày</h3>
                        <p>
                          Lông mày đẹp tự nhiên giúp tôi tự tin hơn trong cuộc
                          sống
                        </p>
                      </>
                    )}
                    {idx === 2 && (
                      <>
                        <h3>Không còn lo lắng</h3>
                        <p>Kết quả hoàn hảo vượt ngoài mong đợi của tôi</p>
                      </>
                    )}
                    <button className={styles.viewMoreButton}>Xem thêm</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default BeautyKnowledge;
