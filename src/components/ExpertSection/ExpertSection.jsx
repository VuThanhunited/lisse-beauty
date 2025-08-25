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
  const [currentExpert, setCurrentExpert] = useState(0);
  
  // Services-like carousel state for Expert section
  const [visibleCount, setVisibleCount] = useState(
    typeof window !== "undefined" && window.innerWidth <= 768 ? 1 : 2
  );
  const clonesCount = Math.max(1, visibleCount);
  const expTrackRef = useRef(null);
  const [expIndex, setExpIndex] = useState(clonesCount);
  const [expIsTransitioning, setExpIsTransitioning] = useState(true);
  const [expStepPx, setExpStepPx] = useState(0);

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

  const nextExpert = () => {
    setExpIndex((p) => p + 1);
  };

  const prevExpert = () => {
    setExpIndex((p) => p - 1);
  };

  // Prepare extended experts with clones (like services)
  const displayedExperts = useMemo(() => experts, [experts]);

  // Smart navigation to specific slide
  const goToSlide = useCallback(
    (targetIndex) => {
      const n = displayedExperts.length;
      if (n === 0) return;
      
      // Direct jump to target slide (considering clones)
      const targetExpIndex = clonesCount + targetIndex;
      setExpIndex(targetExpIndex);
    },
    [displayedExperts.length, clonesCount]
  );

  const extendedExperts = useMemo(() => {
    const n = displayedExperts.length;
    if (n === 0) return [];
    const cc = Math.max(1, Math.min(clonesCount, n));
    const head = displayedExperts.slice(0, cc);
    const tail = displayedExperts.slice(-cc);
    return [...tail, ...displayedExperts, ...head];
  }, [displayedExperts, clonesCount]);

  // Measure slide width + gap
  useEffect(() => {
    const measureStep = () => {
      const track = expTrackRef.current;
      if (!track) return;
      const firstSlide = track.querySelector(`.${styles.expertSlideItem}`);
      if (!firstSlide) return;
      const slideW = firstSlide.getBoundingClientRect().width;
      const stylesComp = window.getComputedStyle(track);
      const gapStr = stylesComp.columnGap || stylesComp.gap || "0px";
      const gap = parseFloat(gapStr) || 0;
      setExpStepPx(slideW + gap);
    };
    measureStep();
    window.addEventListener("resize", measureStep);
    return () => window.removeEventListener("resize", measureStep);
  }, [displayedExperts.length, visibleCount]);

  // Responsive visible count
  useEffect(() => {
    const handleResize = () => {
      setVisibleCount(window.innerWidth <= 768 ? 1 : 2);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Reset index when clonesCount or data change
  useEffect(() => {
    setExpIsTransitioning(false);
    setExpIndex(Math.max(1, clonesCount));
    const id = requestAnimationFrame(() =>
      requestAnimationFrame(() => setExpIsTransitioning(true))
    );
    return () => cancelAnimationFrame(id);
  }, [clonesCount, displayedExperts.length]);

  // Snap when reaching clones
  const handleExpTransitionEnd = useCallback(() => {
    const n = displayedExperts.length;
    if (n === 0) return;
    const firstReal = clonesCount;
    const lastReal = clonesCount + n - 1;
    if (expIndex < firstReal) {
      setExpIsTransitioning(false);
      setExpIndex(lastReal);
      requestAnimationFrame(() =>
        requestAnimationFrame(() => setExpIsTransitioning(true))
      );
    } else if (expIndex > lastReal) {
      setExpIsTransitioning(false);
      setExpIndex(firstReal);
      requestAnimationFrame(() =>
        requestAnimationFrame(() => setExpIsTransitioning(true))
      );
    }
  }, [expIndex, displayedExperts.length, clonesCount]);

  // Sync currentExpert from expIndex
  useEffect(() => {
    const n = displayedExperts.length;
    if (n === 0) return;
    const current = (((expIndex - clonesCount) % n) + n) % n;
    setCurrentExpert(current);
  }, [expIndex, displayedExperts.length, clonesCount]);

  return (
    <div className={styles.brandStoryPage}>
      {/* Main Content */}
      <div className={styles.mainContent}>
        {/* Expert Team Section */}
        <div className={styles.expertSection}>
          <div className={styles.container}>
            <h2>Đội ngũ chuyên gia</h2>
            <div className={styles.expertCarousel}>
              <button className={styles.carouselBtn} onClick={prevExpert}>
                ‹
              </button>

              {/* Services-like track with clones */}
              <div className={styles.expertCarouselContainer}>
                <div
                  className={styles.expertTrack}
                  ref={expTrackRef}
                  style={{
                    transform: `translate3d(-${expIndex * expStepPx}px, 0, 0)`,
                    transition: expIsTransitioning
                      ? "transform 500ms ease"
                      : "none",
                  }}
                  onTransitionEnd={handleExpTransitionEnd}
                >
                  {extendedExperts.map((expert, index) => (
                    <div
                      key={`${expert.id}-${index}`}
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

              <button className={styles.carouselBtn} onClick={nextExpert}>
                ›
              </button>
            </div>

            {/* Carousel indicators */}
            <div className={styles.carouselIndicators}>
              {experts.map((_, index) => (
                <button
                  key={index}
                  className={`${styles.indicator} ${
                    index === currentExpert ? styles.active : ""
                  }`}
                  onClick={() => goToSlide(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpertSection;
