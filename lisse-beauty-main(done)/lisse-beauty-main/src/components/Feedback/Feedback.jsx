import styles from "./Feedback.module.css";
import { useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";

const FeedbackContent = () => {
  // Data state
  const [feedback, setFeedback] = useState({ results: [] });

  // Feedback carousel state
  const [currentFeedbackSlide, setCurrentFeedbackSlide] = useState(1); // Start at 1 (first real card)
  const totalFeedbackCards = 4; // Tổng số feedback cards
  const [cardWidth, setCardWidth] = useState(320); // Responsive card width
  const [isTransitioning, setIsTransitioning] = useState(true);

  // Axios headers
  const headers = useMemo(
    () => ({ Authorization: "TOKEN 2AuVTwbx241MuVxjqnlzUh73SEBPtuzk" }),
    []
  );
  // Fetch feedback
  useEffect(() => {
    const fetchFeedbackData = async () => {
      try {
        const response = await axios.get(
          "https://api.baserow.io/api/database/rows/table/644174/?user_field_names=true",
          { headers }
        );
        setFeedback(response.data || { results: [] });
      } catch (error) {
        console.error("Error fetching feedback data:", error);
      }
    };
    fetchFeedbackData();
  }, [headers]);

  // Feedback carousel functions - infinite loop with seamless transition
  const nextFeedbackSlide = useCallback(() => {
    if (!isTransitioning) return;
    
    setCurrentFeedbackSlide((prev) => prev + 1);
  }, [isTransitioning]);

  const prevFeedbackSlide = useCallback(() => {
    if (!isTransitioning) return;
    
    setCurrentFeedbackSlide((prev) => prev - 1);
  }, [isTransitioning]);

  // Handle seamless loop transitions
  const handleTransitionEnd = useCallback(() => {
    setIsTransitioning(false);
    
    if (currentFeedbackSlide >= totalFeedbackCards + 1) {
      setCurrentFeedbackSlide(1); // Jump to first real card
    } else if (currentFeedbackSlide <= 0) {
      setCurrentFeedbackSlide(totalFeedbackCards); // Jump to last real card
    }
    
    setTimeout(() => setIsTransitioning(true), 50);
  }, [currentFeedbackSlide, totalFeedbackCards]);

  // Responsive card width and gap
  const [gap, setGap] = useState(30);

  useEffect(() => {
    const updateCardWidth = () => {
      if (window.innerWidth <= 480) {
        setCardWidth(window.innerWidth - 80); // Mobile nhỏ
        setGap(15);
      } else if (window.innerWidth <= 768) {
        setCardWidth(250); // Mobile
        setGap(20);
      } else if (window.innerWidth <= 1024) {
        setCardWidth(280); // Tablet
        setGap(25);
      } else {
        setCardWidth(320); // Desktop
        setGap(30);
      }
    };

    updateCardWidth();
    window.addEventListener("resize", updateCardWidth);
    return () => window.removeEventListener("resize", updateCardWidth);
  }, []);

  // Auto-play feedback carousel
  useEffect(() => {
    const interval = setInterval(() => {
      nextFeedbackSlide();
    }, 4000); // Chuyển slide mỗi 4 giây

    return () => clearInterval(interval);
  }, [nextFeedbackSlide]);

  // Scroll to top when clicking the header arrow button
  const scrollToTop = useCallback(() => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, []);

  return (
    <div className={styles.feedbackContent}>
      {/* Feedback */}
      <div className={styles.feedbackSection}>
        <div className={styles.feedbackInner}>
          {/* Header với tiêu đề và mô tả */}
          <div className={styles.feedbackHeader}>
            <div className={styles.headerRowSpaceBetween}>
              <div className={styles.sectionTitleWrap}>
                <div className={styles.titleRow}>
                  <h2 className={styles.feedbackTitle}>Feedback khách hàng</h2>
                </div>
              </div>
              <button
                className={`${styles.titleArrowBtn} ${styles.titleArrowBtnRight}`}
                aria-label="Lên đầu trang"
                onClick={scrollToTop}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    scrollToTop();
                  }
                }}
              >
                <span className={`${styles.arrowIcon} ${styles.arrowSlanted}`}>
                  ↗
                </span>
                <span className={`${styles.arrowIcon} ${styles.arrowRight}`}>
                  →
                </span>
              </button>
              <div
                className={`${styles.sectionUnderline} ${styles.sectionUnderlineFull}`}
              ></div>
            </div>
            <p className={styles.feedbackSubtitle}>
              Chúng tôi đạt đánh giá từ khách hàng – <strong>4.9</strong> trên{" "}
              <strong>5</strong>
            </p>
            <div className={styles.feedbackDivider}></div>
          </div>

          {/* Slideshow với navigation arrows */}
          <div className={styles.feedbackSlideshow}>
            <button
              className={`${styles.feedbackArrow} ${styles.feedbackArrowLeft}`}
              aria-label="Feedback trước"
              onClick={prevFeedbackSlide}
            >
              ❮
            </button>

            <div className={styles.feedbackContainer}>
              <div
                className={styles.feedbackTrack}
                style={{
                  transform: `translateX(-${
                    currentFeedbackSlide * (cardWidth + gap)
                  }px)`,
                  transition: isTransitioning
                    ? "transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)"
                    : "none",
                }}
                onTransitionEnd={handleTransitionEnd}
              >
                {/* Clone of last card for seamless loop */}
                <div className={styles.feedbackCard}>
                  <div
                    className={styles.feedbackCardBg}
                    style={{
                      backgroundImage: `url(${
                        feedback?.results?.[3]?.userImg?.[0]?.url || ""
                      })`,
                    }}
                  ></div>
                  <div className={styles.feedbackCardOverlay}>
                    <div className={styles.feedbackStars}>⭐⭐⭐⭐⭐</div>
                    <div className={styles.feedbackContent}>
                      <h4 className={styles.feedbackName}>Nguyễn Thúy Tiên</h4>
                      <p className={styles.feedbackComment}>
                        Dịch vụ tốt, quá trình làm không đau, không bị xưng, màu
                        môi chị Thoa làm cho em rất là ưng ý, tuyệt vời á
                      </p>
                    </div>
                  </div>
                </div>
                {/* Text feedback cards */}
                <div className={styles.feedbackCard}>
                  <div
                    className={styles.feedbackCardBg}
                    style={{
                      backgroundImage: `url(${
                        feedback?.results?.[0]?.userImg?.[0]?.url || ""
                      })`,
                    }}
                  ></div>
                  <div className={styles.feedbackCardOverlay}>
                    <div className={styles.feedbackStars}>⭐⭐⭐⭐⭐</div>
                    <div className={styles.feedbackContent}>
                      <h4 className={styles.feedbackName}>Nguyễn Thúy Tiên</h4>
                      <p className={styles.feedbackComment}>
                        Dịch vụ tốt, quá trình làm không đau, không bị xưng, màu
                        môi chị Thoa làm cho em rất là ưng ý, tuyệt vời á
                      </p>
                    </div>
                  </div>
                </div>

                <div className={styles.feedbackCard}>
                  <div
                    className={styles.feedbackCardBg}
                    style={{
                      backgroundImage: `url(${
                        feedback?.results?.[1]?.userImg?.[0]?.url || ""
                      })`,
                    }}
                  ></div>
                  <div className={styles.feedbackCardOverlay}>
                    <div className={styles.feedbackStars}>⭐⭐⭐⭐⭐</div>
                    <div className={styles.feedbackContent}>
                      <h4 className={styles.feedbackName}>Nguyễn Thúy Tiên</h4>
                      <p className={styles.feedbackComment}>
                        Dịch vụ tốt, quá trình làm không đau, không bị xưng, màu
                        môi chị Thoa làm cho em rất là ưng ý, tuyệt vời á
                      </p>
                    </div>
                  </div>
                </div>

                {/* Video feedback card */}
                <div
                  className={`${styles.feedbackCard} ${styles.feedbackCardVideo}`}
                >
                  <div
                    className={styles.feedbackCardBg}
                    style={{
                      backgroundImage: `url(${
                        feedback?.results?.[2]?.userImg?.[0]?.url || ""
                      })`,
                    }}
                  ></div>
                  <div className={styles.playButton}>
                    <div className={styles.playIcon}>▶</div>
                  </div>
                </div>

                {/* Additional cards for sliding */}
                <div className={styles.feedbackCard}>
                  <div
                    className={styles.feedbackCardBg}
                    style={{
                      backgroundImage: `url(${
                        feedback?.results?.[3]?.userImg?.[0]?.url || ""
                      })`,
                    }}
                  ></div>
                  <div className={styles.feedbackCardOverlay}>
                    <div className={styles.feedbackStars}>⭐⭐⭐⭐⭐</div>
                    <div className={styles.feedbackContent}>
                      <h4 className={styles.feedbackName}>Nguyễn Thúy Tiên</h4>
                      <p className={styles.feedbackComment}>
                        Dịch vụ tốt, quá trình làm không đau, không bị xưng, màu
                        môi chị Thoa làm cho em rất là ưng ý, tuyệt vời á
                      </p>
                    </div>
                  </div>
                </div>

                {/* Clone of first card for seamless loop */}
                <div className={styles.feedbackCard}>
                  <div
                    className={styles.feedbackCardBg}
                    style={{
                      backgroundImage: `url(${
                        feedback?.results?.[0]?.userImg?.[0]?.url || ""
                      })`,
                    }}
                  ></div>
                  <div className={styles.feedbackCardOverlay}>
                    <div className={styles.feedbackStars}>⭐⭐⭐⭐⭐</div>
                    <div className={styles.feedbackContent}>
                      <h4 className={styles.feedbackName}>Nguyễn Thúy Tiên</h4>
                      <p className={styles.feedbackComment}>
                        Dịch vụ tốt, quá trình làm không đau, không bị xưng, màu
                        môi chị Thoa làm cho em rất là ưng ý, tuyệt vời á
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <button
              className={`${styles.feedbackArrow} ${styles.feedbackArrowRight}`}
              aria-label="Feedback tiếp theo"
              onClick={nextFeedbackSlide}
            >
              ❯
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackContent;
