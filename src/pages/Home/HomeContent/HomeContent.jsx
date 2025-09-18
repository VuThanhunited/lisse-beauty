import styles from "./HomeContent.module.css";
import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import axios from "axios";
import facility1 from "../../../data/KimlyIMG/Ban-sao-Lax56484Kim-Ly-scaled-e1751540571892.webp";
import Footer from "../../../components/Footer/Footer";
import Facility from "../../../components/Facility/Facility";
import FeedbackContent from "../../../components/Feedback/Feedback";
import Header from "../../../components/Header/Header";
import {
  optimizeScrollPerformance,
  preloadCriticalImages,
  throttle,
} from "../../../utils/performanceUtils";

// Inline scroll optimization utilities
const optimizeElementForScroll = (element) => {
  if (!element) return;
  const style = element.style;
  style.transform = style.transform || "translateZ(0)";
  style.willChange = "transform, scroll-position";
  style.backfaceVisibility = "hidden";
  style.scrollBehavior = "smooth";
  style.contain = "layout style paint";
  return element;
};

// Before/After Slider Component (kept minimal and self-contained)
const BeforeAfterSlider = ({
  beforeImage,
  afterImage,
  title,
  showTitle = true,
}) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);
  const labelRef = useRef(null);
  const [labelLeft, setLabelLeft] = useState(null);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    e.preventDefault();
  };

  const throttledMouseMove = useMemo(
    () =>
      throttle((e) => {
        if (!isDragging || !containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const percentage = (x / rect.width) * 100;
        setSliderPosition(Math.max(0, Math.min(100, percentage)));
      }, 16), // ~60fps throttling
    [isDragging]
  );

  const handleMouseMove = useCallback(
    (e) => {
      throttledMouseMove(e);
    },
    [throttledMouseMove]
  );

  const handleMouseUp = useCallback(() => setIsDragging(false), []);

  const handleLocalMouseMove = (e) => {
    if (!isDragging) return;
    handleMouseMove(e);
  };

  useEffect(() => {
    if (!isDragging) return;
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // Compute label position: stick to center until handle passes center, then follow handle
  const computeLabelLeft = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const width = rect.width;
    const handleX = (sliderPosition / 100) * width;
    const centerX = width / 2;
    const offset = 10; // px gap from handle
    const labelWidth = labelRef.current?.offsetWidth || 0;

    let desired = Math.max(centerX, handleX + offset);
    // Keep inside right bound
    const rightMargin = 12;
    if (desired + labelWidth > width - rightMargin) {
      desired = Math.max(centerX, width - rightMargin - labelWidth);
    }
    // Keep inside left bound
    const leftMargin = 12;
    if (desired < leftMargin) desired = leftMargin;

    setLabelLeft(desired);
  }, [sliderPosition]);

  useEffect(() => {
    computeLabelLeft();
  }, [computeLabelLeft]);

  useEffect(() => {
    const onResize = () => computeLabelLeft();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [computeLabelLeft]);

  return (
    <div className={styles.beforeAfterContainer}>
      <div
        ref={containerRef}
        className={styles.beforeAfterSlider}
        onMouseMove={handleLocalMouseMove}
        onMouseDown={handleMouseDown}
      >
        <div className={styles.beforeImage}>
          <img
            src={beforeImage}
            alt={`${title} - Trước`}
            loading="eager"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transform: "translateZ(0)",
              backfaceVisibility: "hidden",
            }}
          />
          <div className={styles.imageLabel}>TRƯỚC</div>
        </div>
        <div
          className={styles.afterImage}
          style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
        >
          <img
            src={afterImage}
            alt={`${title} - Sau`}
            loading="eager"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transform: "translateZ(0)",
              backfaceVisibility: "hidden",
            }}
          />
          <div className={styles.imageLabel}>SAU</div>
        </div>
        <div
          className={styles.sliderHandle}
          style={{ left: `${sliderPosition}%` }}
        >
          <div className={styles.sliderLine}></div>
          <div className={styles.sliderButton}>
            <span>‹</span>
            <span>›</span>
          </div>
        </div>
        {/* Service name follows the divider position */}
        <div
          ref={labelRef}
          className={styles.afterServiceName}
          style={
            labelLeft == null
              ? { left: "50%", transform: "translateX(-50%)" }
              : { left: `${labelLeft}px` }
          }
        >
          {title}
        </div>
      </div>
      {showTitle && (
        <div className={styles.beforeAfterTitle}>
          <h3>{title}</h3>
        </div>
      )}
    </div>
  );
};

const HomeContent = () => {
  // Refs for scroll optimization
  const containerRef = useRef(null);

  // Initialize performance optimizations
  useEffect(() => {
    optimizeScrollPerformance();

    // Initialize scroll optimizations
    if (containerRef.current) {
      optimizeElementForScroll(containerRef.current);

      // Add momentum scrolling for touch devices
      const style = containerRef.current.style;
      style.webkitOverflowScrolling = "touch";
      style.overflowScrolling = "touch";
    }

    // Add global CSS for smooth scrolling
    const style = document.createElement("style");
    style.textContent = `
      html {
        scroll-behavior: smooth;
        scroll-padding-top: 80px;
      }
      
      .${styles.homeContent} {
        will-change: transform;
        transform: translateZ(0);
        backface-visibility: hidden;
      }
      
      .${styles.servicesCarousel} {
        will-change: transform;
        transform: translateZ(0);
        transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }
    `;
    document.head.appendChild(style);

    return () => {
      if (style.parentNode) {
        style.parentNode.removeChild(style);
      }
    };
  }, []);

  // Data state
  const [services, setServices] = useState([]);
  const [activeStoryIndex, setActiveStoryIndex] = useState(null);

  // Services slideshow state (discrete with infinite loop)
  const [visibleCount, setVisibleCount] = useState(
    typeof window !== "undefined" && window.innerWidth <= 768 ? 1 : 3
  );
  const clonesCount = Math.max(1, visibleCount);
  const [svcIndex, setSvcIndex] = useState(clonesCount);
  const [svcIsTransitioning, setSvcIsTransitioning] = useState(true);
  const svcTrackRef = useRef(null);
  const [svcStepPx, setSvcStepPx] = useState(0);
  const [svcAuto] = useState(false);

  // Axios headers
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

        // Preload critical images for better performance
        const criticalImages =
          response.data.results
            ?.slice(0, 2)
            .map((service) => service.serviceImage?.[0]?.url)
            .filter(Boolean) || [];

        if (criticalImages.length > 0) {
          preloadCriticalImages(criticalImages);
        }
      } catch (error) {
        console.error("Error fetching service data:", error);
      }
    };
    fetchServiceData();
  }, [headers]);

  // Prepare slides (shared for hero/services)
  const displayedServices = useMemo(() => services.slice(0, 4), [services]);
  const extendedServices = useMemo(() => {
    const n = displayedServices.length;
    if (n === 0) return [];
    const cc = Math.max(1, Math.min(clonesCount, n));
    const head = displayedServices.slice(0, cc);
    const tail = displayedServices.slice(-cc);
    return [...tail, ...displayedServices, ...head];
  }, [displayedServices, clonesCount]);

  // (removed carousel autoplay and snapping)

  // Services responsive visible count and step measurement
  useEffect(() => {
    const handleResize = () => {
      setVisibleCount(window.innerWidth <= 768 ? 1 : 3);
    };

    const measureStep = () => {
      const track = svcTrackRef.current;
      if (!track) return;
      const firstSlide = track.querySelector(`.${styles.slideItem}`);
      if (!firstSlide) return;
      const slideW = firstSlide.getBoundingClientRect().width;
      const stylesComp = window.getComputedStyle(track);
      const gapStr = stylesComp.columnGap || stylesComp.gap || "0px";
      const gap = parseFloat(gapStr) || 0;
      setSvcStepPx(slideW + gap);
    };
    handleResize();
    measureStep();
    window.addEventListener("resize", handleResize);
    window.addEventListener("resize", measureStep);
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("resize", measureStep);
    };
  }, [displayedServices.length]);

  // Reset index when data or clonesCount change
  useEffect(() => {
    setSvcIsTransitioning(false);
    setSvcIndex(Math.max(1, clonesCount));
    const id = requestAnimationFrame(() =>
      requestAnimationFrame(() => setSvcIsTransitioning(true))
    );
    return () => cancelAnimationFrame(id);
  }, [clonesCount, displayedServices.length]);

  // Services autoplay
  useEffect(() => {
    if (!svcAuto || svcStepPx <= 0 || displayedServices.length === 0) return;
    const id = setInterval(() => setSvcIndex((p) => p + 1), 3000);
    return () => clearInterval(id);
  }, [svcAuto, svcStepPx, displayedServices.length]);

  // Services snapping
  const handleSvcTransitionEnd = useCallback(() => {
    if (extendedServices.length === 0) return;
    const n = displayedServices.length;
    const firstReal = clonesCount;
    const lastReal = clonesCount + n - 1;
    if (svcIndex < firstReal) {
      // Stepped into left clones -> snap to last real
      setSvcIsTransitioning(false);
      setSvcIndex(lastReal);
      requestAnimationFrame(() =>
        requestAnimationFrame(() => setSvcIsTransitioning(true))
      );
    } else if (svcIndex > lastReal) {
      // Stepped into right clones -> snap to first real
      setSvcIsTransitioning(false);
      setSvcIndex(firstReal);
      requestAnimationFrame(() =>
        requestAnimationFrame(() => setSvcIsTransitioning(true))
      );
    }
  }, [
    svcIndex,
    displayedServices.length,
    extendedServices.length,
    clonesCount,
  ]);

  // Optimized scroll to top with smooth animation
  const scrollToTop = useCallback(() => {
    if (typeof window !== "undefined") {
      // Use our optimized smooth scroll
      const startY = window.pageYOffset;
      const targetY = 0;
      const duration = 1000;
      const startTime = performance.now();

      const animateScroll = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function for smooth animation
        const easeInOutCubic = (t) =>
          t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
        const easedProgress = easeInOutCubic(progress);

        const currentY = startY + (targetY - startY) * easedProgress;
        window.scrollTo(0, currentY);

        if (progress < 1) {
          requestAnimationFrame(animateScroll);
        }
      };

      requestAnimationFrame(animateScroll);
    }
  }, []);

  // Mobile-only toggle for story overlay; desktop will use CSS :hover
  const handleStoryClick = useCallback((idx) => {
    if (typeof window === "undefined") return;
    const isTouchDevice =
      window.matchMedia && window.matchMedia("(hover: none)").matches;
    if (!isTouchDevice) return; // ignore clicks on desktop
    setActiveStoryIndex((cur) => (cur === idx ? null : idx));
  }, []);

  return (
    <div
      className={`${styles.homeContent} scroll-container`}
      ref={containerRef}
    >
      {/* Mobile Header */}
      <div className={styles.mobileHeaderWrapper}>
        <Header />
      </div>

      {/* Services - Slideshow */}
      <div className={`${styles.servicesSection} animate`} id="services">
        <div className={styles.sectionHeader}>
          <div className={styles.headerRowSpaceBetween}>
            <div className={styles.sectionTitleWrap}>
              <div className={styles.titleRow}>
                <h2 className={styles.sectionHeading}>Các dịch vụ làm đẹp</h2>
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
          </div>
        </div>

        <div className={styles.carousel}>
          <div className={styles.carouselContainer}>
            <div
              className={`${styles.carouselTrack} carousel-track`}
              ref={svcTrackRef}
              style={{
                transform: `translate3d(-${svcIndex * svcStepPx}px, 0, 0)`,
                transition: svcIsTransitioning
                  ? "transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
                  : "none",
                willChange: "transform",
                backfaceVisibility: "hidden",
              }}
              onTransitionEnd={handleSvcTransitionEnd}
            >
              {extendedServices.map((service, index) => {
                // Determine the visually centered card index
                const centerOffset = visibleCount === 3 ? 1 : 0;
                const isCenter = index === svcIndex + centerOffset;
                return (
                  <div
                    key={`${service.id}-${index}`}
                    className={`${styles.slideItem} ${styles.customSlide} ${
                      isCenter ? styles.centerActive : ""
                    }`}
                  >
                    <div
                      className={
                        styles.slideImage + " " + styles.customSlideImage
                      }
                    >
                      <img
                        src={
                          service.serviceImage &&
                          service.serviceImage.length > 0
                            ? service.serviceImage[0].url
                            : ""
                        }
                        alt={service.title}
                        className={styles.slideImgRounded}
                        loading="auto"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          transform: "translateZ(0)",
                          backfaceVisibility: "hidden",
                        }}
                      />
                      <div
                        className={`${styles.slideOverlay} ${
                          styles.customSlideOverlay
                        } ${isCenter ? styles.centerTint : ""}`}
                      >
                        <div className={styles.slideTextWrap}>
                          <h3 className={styles.slideTitle}>{service.title}</h3>
                          {service.description ? (
                            <p className={styles.slideSubtitle}>
                              {service.description}
                            </p>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className={styles.carouselNav}>
            <button
              className={styles.prevBtn}
              aria-label="Dịch chuyển dịch vụ trước"
              onClick={() => setSvcIndex((p) => p - 1)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
              </svg>
            </button>
            <button
              className={styles.nextBtn}
              aria-label="Dịch chuyển dịch vụ tiếp theo"
              onClick={() => setSvcIndex((p) => p + 1)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Facilities */}
      <Facility />

      {/* Customer Stories */}
      <div className={styles.customerStoriesSection}>
        <div className={styles.sectionHeader}>
          <div className={styles.headerRowSpaceBetween}>
            <div className={styles.sectionTitleWrap}>
              <div className={styles.titleRow}>
                <h2 className={styles.storiesTitle}>Câu chuyện khách hàng</h2>
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

            <p className={styles.storiesSubtitle}>
              Cùng chúng tôi kể lên câu chuyện của chính mình
            </p>
          </div>
        </div>

        <div className={styles.storiesContainer}>
          {[0, 1, 2].map((idx) => (
            <div
              className={`${styles.storyCard} ${
                activeStoryIndex === idx ? styles.isActive : ""
              }`}
              key={idx}
              onClick={() => handleStoryClick(idx)}
            >
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
                  loading={idx < 2 ? "eager" : "auto"}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    transform: "translateZ(0)",
                    backfaceVisibility: "hidden",
                  }}
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

      {/* Hero Banner */}
      <div className={styles.heroSection}>
        <div className={styles.heroOverlay}>
          <h1 className={styles.heroTitle}>
            Mỗi khách hàng đều là{" "}
            <span className={styles.scriptText}>đại sứ thương hiệu</span>
          </h1>
        </div>
      </div>

      {/* Ambassador three-up before/after gallery (no carousel) */}
      <div className={styles.ambassadorSection}>
        <div className={styles.ambassadorGrid}>
          {displayedServices.slice(0, 3).map((service, index) => (
            <BeforeAfterSlider
              key={`ambassador-${service.id}-${index}`}
              beforeImage={
                service.beforeImg && service.beforeImg.length > 0
                  ? service.beforeImg[0].url
                  : ""
              }
              afterImage={
                service.afterImg && service.afterImg.length > 0
                  ? service.afterImg[0].url
                  : ""
              }
              title={service.title}
              showTitle={false}
            />
          ))}
        </div>
      </div>
      <FeedbackContent />
      {/* Booking */}
      <div className={styles.bookingSection}>
        <div className={styles.bookingContainer}>
          <div className={styles.bookingImageSection}>
            <img
              src={facility1}
              alt="Chuyên gia tư vấn"
              className={styles.bookingImage}
              loading="auto"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                transform: "translateZ(0)",
                backfaceVisibility: "hidden",
              }}
            />
          </div>
          <div className={styles.bookingFormSection}>
            <h2 className={styles.bookingTitle}>Đặt lịch ngay!</h2>
            <div className={styles.bookingForm}>
              <input
                type="text"
                placeholder="Nhập tên của bạn"
                className={styles.formInput}
              />
              <input
                type="tel"
                placeholder="Số điện thoại"
                className={styles.formInput}
              />
              <input
                type="email"
                placeholder="Email của bạn"
                className={styles.formInput}
              />
              <select className={styles.formInput}>
                <option>Chọn dịch vụ</option>
                <option>Foxbrows</option>
                <option>Hair stroke</option>
                <option>Sketchlips</option>
                <option>Beauty Care</option>
              </select>
              <select className={styles.formInput}>
                <option>Chọn ca sở gần bạn</option>
                <option>Cơ sở 1 - TP.HCM</option>
                <option>Cơ sở 2 - Hà Nội</option>
                <option>Cơ sở 3 - Đà Nẵng</option>
              </select>
              <button className={styles.bookingSubmitBtn}>
                ĐẶT LỊCH ĐỂ ĐƯỢC TƯ VẤN NGAY →
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default HomeContent;
