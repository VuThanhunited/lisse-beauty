import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import styles from "./BeautyKnowledge.module.css";
// Import images
import bannerImg from "../../data/banner.jpg";
import glowingBrowImg from "../../data/518600115_122120764574891459_5021028668652265494_n.jpg";
import hairstrokeImg from "../../data/519421760_122120777714891459_5490134016365387672_n.jpg";
import customerImg1 from "../../data/520240366_122120843918891459_7638784159492956398_n.jpg";

const BeautyKnowledge = () => {
  const navigate = useNavigate();
  const handleGlowingBrowClick = () => {
    navigate("/beauty-knowledge/glowing-brow");
  };

  const handleHairstrokeClick = () => {
    navigate("/beauty-knowledge/hairstroke");
  };
  return (
    <div className={styles.beautyKnowledgePage}>
      <Navbar />

      {/* Banner Section */}
      <div className={styles.bannerSection}>
        <div className={styles.bannerImageWrapper}>
          <img
            src={bannerImg}
            alt="Kiến thức làm đẹp"
            className={styles.bannerImage}
          />
          <div className={styles.bannerOverlay}>
            <h1>Kiến thức làm đẹp</h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={styles.mainContent}>
        <div className={styles.container}>
          {/* Trending Beauty Section */}
          <div className={styles.trendingSection}>
            <div className={styles.sectionHeader}>
              <h2>Xu hướng làm đẹp</h2>
              <div className={styles.headerIcon}>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 2L15.09 8.26L22 9L17 14L18.18 21L12 17.77L5.82 21L7 14L2 9L8.91 8.26L12 2Z"
                    fill="currentColor"
                  />
                </svg>
              </div>
            </div>

            <div className={styles.knowledgeGrid}>
              {/* Glowing Brow Card */}
              <div className={styles.knowledgeCard}>
                <div className={styles.cardImage}>
                  <img src={glowingBrowImg} alt="Glowing Brow" />
                </div>
                <div className={styles.cardContent}>
                  <h3>Glowing Brow</h3>
                  <p>
                    Glowing Brow là gì? Giải pháp chăn máy tự nhiên, nhẹ nhàng,
                    các nét không tô dậu phần xăm Bön...
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
                    Tạo sợi Hairstroke là kỹ thuật tạm đẹp...
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

          <div className={styles.trendingSection}>
            <div className={styles.sectionHeader}>
              <h2>Phân tích kỹ thuật</h2>
              <div className={styles.headerIcon}>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 2L15.09 8.26L22 9L17 14L18.18 21L12 17.77L5.82 21L7 14L2 9L8.91 8.26L12 2Z"
                    fill="currentColor"
                  />
                </svg>
              </div>
            </div>

            <div className={styles.knowledgeGrid}>
              {/* Glowing Brow Card */}
              <div className={styles.knowledgeCard}>
                <div className={styles.cardImage}>
                  <img src={glowingBrowImg} alt="Glowing Brow" />
                </div>
                <div className={styles.cardContent}>
                  <h3>Glowing Brow</h3>
                  <p>
                    Glowing Brow là gì? Giải pháp chăn máy tự nhiên, nhẹ nhàng,
                    các nét không tô dậu phần xăm Bön...
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
                    Tạo sợi Hairstroke là kỹ thuật tạm đẹp...
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

          {/* Customer Stories Section */}
          <div className={styles.customerStoriesSection}>
            <h2 className={styles.storiesTitle}>Câu chuyện khách hàng</h2>
            <p className={styles.storiesSubtitle}>
              Cùng chúng tôi kể lên câu chuyện của chính mình
            </p>

            <div className={styles.storiesContainer}>
              {/* Story Card 1 */}
              <div className={styles.storyCard}>
                <div className={styles.storyImageWrapper}>
                  <img src={customerImg1} alt="Câu chuyện khách hàng 1" />
                  <div className={styles.storyOverlay}>
                    <div className={styles.storyContent}>
                      <h3>Mỗi sáng thức dậy không lo tìm thời gian</h3>
                      <p>
                        Chúng ta mất 15 phút mỗi sáng để kẻ lông mày, thật là
                        lãng phí
                      </p>
                      <button className={styles.viewMoreButton}>
                        Xem thêm
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Story Card 2 */}
              <div className={styles.storyCard}>
                <div className={styles.storyImageWrapper}>
                  <img src={customerImg1} alt="Câu chuyện khách hàng 2" />
                  <div className={styles.storyOverlay}>
                    <div className={styles.storyContent}>
                      <h3>Tự tin hơn mỗi ngày</h3>
                      <p>
                        Lông mày đẹp tự nhiên giúp tôi tự tin hơn trong cuộc
                        sống
                      </p>
                      <button className={styles.viewMoreButton}>
                        Xem thêm
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Story Card 3 */}
              <div className={styles.storyCard}>
                <div className={styles.storyImageWrapper}>
                  <img src={customerImg1} alt="Câu chuyện khách hàng 3" />
                  <div className={styles.storyOverlay}>
                    <div className={styles.storyContent}>
                      <h3>Không còn lo lắng</h3>
                      <p>Kết quả hoàn hảo vượt ngoài mong đợi của tôi</p>
                      <button className={styles.viewMoreButton}>
                        Xem thêm
                      </button>
                    </div>
                  </div>
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

export default BeautyKnowledge;
