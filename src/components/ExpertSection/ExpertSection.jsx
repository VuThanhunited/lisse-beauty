import React, {
  useEffect,
  useMemo,
  useState,
  useCallback,
  useRef,
} from "react";

import styles from "./ExpertSection.module.css";
import expertImg1 from "../../data/518600115_122120764574891459_5021028668652265494_n.jpg";
import expertImg2 from "../../data/519421760_122120777714891459_5490134016365387672_n.jpg";
import expertImg3 from "../../data/520240366_122120843918891459_7638784159492956398_n.jpg";

const ExpertSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const expTrackRef = useRef(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [visibleCards, setVisibleCards] = useState(
    typeof window !== "undefined" && window.innerWidth <= 768 ? 1 : 2
  );

  const experts = useMemo(
    () => [
      {
        id: 1,
        name: "Trang Nhung",
        image: expertImg1,
        description:
          "Thạc sĩ đoàn viên bản ở đây, khởi tạo và ở về bản để tây chính nơi đáng, phòng cách phòng chú và màu sắc của đoàn văn của bạn.",
      },
      {
        id: 2,
        name: "Mai Linh",
        image: expertImg2,
        description:
          "Chuyên gia về chăm sóc da với hơn 8 năm kinh nghiệm trong ngành làm đẹp và thẩm mỹ.",
      },
      {
        id: 3,
        name: "Thu Hà",
        image: expertImg3,
        description:
          "Bác sĩ thẩm mỹ hàng đầu với nhiều chứng chỉ quốc tế về các phương pháp làm đẹp hiện đại.",
      },
    ],
    []
  );

  const maxSlides = Math.max(0, experts.length - visibleCards + 1);

  const nextExpert = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev + 1) % maxSlides);
    
    setTimeout(() => setIsTransitioning(false), 600);
  }, [maxSlides, isTransitioning]);

  const prevExpert = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev - 1 + maxSlides) % maxSlides);
    
    setTimeout(() => setIsTransitioning(false), 600);
  }, [maxSlides, isTransitioning]);


  // Handle responsive visible cards
  useEffect(() => {
    const handleResize = () => {
      const newVisibleCards = window.innerWidth <= 768 ? 1 : 2;
      setVisibleCards(newVisibleCards);
      setCurrentSlide(0); // Reset to first slide on resize
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Auto-rotation effect (optional)
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isTransitioning) {
        nextExpert();
      }
    }, 4000); // Auto-rotate every 4 seconds
    
    return () => clearInterval(interval);
  }, [nextExpert, isTransitioning]);

  return (
    <div className={styles.brandStoryPage}>
      {/* Main Content */}
      <div className={styles.mainContent}>
        {/* Expert Team Section */}
        <div className={styles.expertSection}>
          <div className={styles.container}>
            <h2>Đội ngũ chuyên gia</h2>
            <div className={styles.expertCarousel}>
              <button 
                className={`${styles.carouselBtn} ${isTransitioning ? styles.disabled : ''}`} 
                onClick={prevExpert}
                disabled={isTransitioning}
              >
                ‹
              </button>

              {/* Horizontal Slideshow Container */}
              <div className={styles.expertCarouselContainer}>
                <div
                  className={styles.expertTrack}
                  ref={expTrackRef}
                  style={{
                    transform: `translateX(-${currentSlide * (100 / visibleCards)}%)`,
                  }}
                >
                  {experts.map((expert, index) => (
                    <div
                      key={expert.id}
                      className={styles.expertSlideItem}
                    >
                      <div className={styles.expertCardV2}>
                        <div className={styles.expertText}>
                          <h3>{expert.name}</h3>
                          <p>{expert.description}</p>
                          <button className={styles.expertOutlineBtn}>
                            <span className={styles.btnTextDefault}>
                              Sản phẩm chuyên gia
                            </span>
                            <span className={styles.btnTextHover}>
                              Xem ngay →
                            </span>
                          </button>
                        </div>
                        <div className={styles.expertPhotoWrap}>
                          <img src={expert.image} alt={expert.name} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button 
                className={`${styles.carouselBtn} ${isTransitioning ? styles.disabled : ''}`} 
                onClick={nextExpert}
                disabled={isTransitioning}
              >
                ›
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpertSection;
