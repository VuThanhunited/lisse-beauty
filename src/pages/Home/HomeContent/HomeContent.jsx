import styles from "./HomeContent.module.css";
import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import axios from "axios";
import facility1 from "../../../data/cơ sở vật chất-1.jpg";
import Footer from "../../../components/Footer/Footer";

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

  const handleMouseMove = useCallback(
    (e) => {
      if (!isDragging || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percentage = (x / rect.width) * 100;
      setSliderPosition(Math.max(0, Math.min(100, percentage)));
    },
    [isDragging]
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
          <img src={beforeImage} alt={`${title} - Trước`} />
          <div className={styles.imageLabel}>TRƯỚC</div>
        </div>
        <div
          className={styles.afterImage}
          style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
        >
          <img src={afterImage} alt={`${title} - Sau`} />
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
  // Data state
  const [services, setServices] = useState([]);
  const [feedback, setFeedback] = useState({ results: [] });

  // Hero banner (static) – no carousel state needed

  // Facilities state
  const [selectedFacilityIndex, setSelectedFacilityIndex] = useState(0);
  const [selectedFacilityLocation, setSelectedFacilityLocation] = useState(0);
  const [facilityAutoPlay, setFacilityAutoPlay] = useState(true);

  // Services slideshow state (discrete with infinite loop)
  const [visibleCount, setVisibleCount] = useState(
    typeof window !== "undefined" && window.innerWidth <= 768 ? 1 : 3
  );
  const clonesCount = Math.max(1, visibleCount - 1);
  const [svcIndex, setSvcIndex] = useState(clonesCount);
  const [svcIsTransitioning, setSvcIsTransitioning] = useState(true);
  const svcTrackRef = useRef(null);
  const [svcStepPx, setSvcStepPx] = useState(0);
  const [svcAuto] = useState(true);

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
      } catch (error) {
        console.error("Error fetching service data:", error);
      }
    };
    fetchServiceData();
  }, [headers]);

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

  // Facilities: derived images for selected location
  const facilityImages = useMemo(() => {
    const svc =
      services[selectedFacilityLocation] &&
      services[selectedFacilityLocation].facilityImg &&
      services[selectedFacilityLocation].facilityImg.length > 0
        ? services[selectedFacilityLocation]
        : services[0];
    return svc && svc.facilityImg ? svc.facilityImg : [];
  }, [services, selectedFacilityLocation]);

  // Keep facility index in range
  useEffect(() => {
    if (selectedFacilityIndex >= facilityImages.length) {
      setSelectedFacilityIndex(0);
    }
  }, [facilityImages.length, selectedFacilityIndex]);

  // Facilities autoplay
  useEffect(() => {
    if (!facilityAutoPlay || facilityImages.length <= 1) return;
    const id = setInterval(() => {
      setSelectedFacilityIndex((prev) =>
        facilityImages.length > 0 ? (prev + 1) % facilityImages.length : 0
      );
    }, 3000);
    return () => clearInterval(id);
  }, [facilityAutoPlay, facilityImages.length]);

  return (
    <div className={styles.homeContent}>
      {/* Services - Slideshow */}
      <div className={styles.servicesSection} id="services">
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionHeading}>Các dịch vụ làm đẹp</h2>
          <div className={styles.sectionUnderline}></div>
        </div>
        <div className={styles.carousel}>
          <div className={styles.carouselContainer}>
            <button
              className={styles.prevBtn}
              aria-label="Dịch chuyển dịch vụ trước"
              onClick={() => setSvcIndex((p) => p - 1)}
            >
              &#8249;
            </button>
            <div
              className={styles.carouselTrack}
              ref={svcTrackRef}
              style={{
                transform: `translate3d(-${svcIndex * svcStepPx}px, 0, 0)`,
                transition: svcIsTransitioning
                  ? "transform 500ms ease"
                  : "none",
              }}
              onTransitionEnd={handleSvcTransitionEnd}
            >
              {extendedServices.map((service, index) => {
                const n = displayedServices.length;
                const firstReal = clonesCount;
                const lastReal = clonesCount + n - 1;
                // Determine center index among visible slides
                const centerOffset = Math.floor(visibleCount / 2);
                const centerIdx = svcIndex + centerOffset;
                const isCenter =
                  index === centerIdx &&
                  index >= firstReal &&
                  index <= lastReal;
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
                      />
                      <div
                        className={`${styles.slideOverlay} ${styles.customSlideOverlay}`}
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
            <button
              className={styles.nextBtn}
              aria-label="Dịch chuyển dịch vụ tiếp theo"
              onClick={() => setSvcIndex((p) => p + 1)}
            >
              &#8250;
            </button>
          </div>
        </div>
      </div>

      {/* Facilities */}
      <div className={styles.lisseBeautyFacilitiesSection}>
        <div className={styles.facilitiesHeader}>
          <h2 className={styles.facilitiesHeading}>Cơ sở vật chất tại KIMLY</h2>
          <div className={styles.facilitiesHeadingBar}></div>
          <div className={styles.facilityTabs}>
            {[
              "343 Nguyễn Khang",
              "146 Trưng Phụng",
              "58 Lê Thị Riêng",
              "137 Lê Thị Riêng",
              "Vạn Phúc",
            ].map((label, idx) => (
              <button
                key={idx}
                className={`${styles.facilityTab} ${
                  selectedFacilityLocation === idx
                    ? styles.activeFacilityTab
                    : ""
                }`}
                onClick={() => {
                  setSelectedFacilityLocation(idx);
                  setSelectedFacilityIndex(0);
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        <div
          className={styles.kimlyFacilitiesContainer}
          onMouseEnter={() => setFacilityAutoPlay(false)}
          onMouseLeave={() => setFacilityAutoPlay(true)}
        >
          {(() => {
            const svc =
              services[selectedFacilityLocation] &&
              services[selectedFacilityLocation].facilityImg &&
              services[selectedFacilityLocation].facilityImg.length > 0
                ? services[selectedFacilityLocation]
                : services[0];
            if (!svc || !svc.facilityImg || svc.facilityImg.length === 0)
              return null;
            const images = svc.facilityImg;
            return (
              <>
                <div className={styles.mainFacilityImage}>
                  <img
                    key={selectedFacilityIndex}
                    src={
                      images[selectedFacilityIndex]
                        ? images[selectedFacilityIndex].url
                        : images[0].url
                    }
                    alt="Phòng điều trị chính Lisse Beauty"
                    className={styles.mainFacilityPhoto}
                  />
                </div>
                {/* Marquee-style infinite thumbnails row */}
                <div className={styles.facilityThumbsMarquee}>
                  <div className={styles.facilityThumbsTrack}>
                    {[...images, ...images].map((img, mapIdx) => {
                      const realIdx = mapIdx % images.length;
                      const isActive = realIdx === selectedFacilityIndex;
                      return (
                        <div
                          className={`${styles.facilityThumbItem} ${
                            isActive ? styles.activeThumbnail : ""
                          }`}
                          key={`thumb-${mapIdx}`}
                          onClick={() => setSelectedFacilityIndex(realIdx)}
                          role="button"
                          aria-label={`Xem ảnh cơ sở vật chất ${realIdx + 1}`}
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              setSelectedFacilityIndex(realIdx);
                            }
                          }}
                        >
                          <img
                            src={img.url}
                            alt={`Cơ sở vật chất ${realIdx + 1}`}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            );
          })()}
        </div>
      </div>

      {/* Customer Stories */}
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

      {/* Feedback */}
      <div className={styles.feedbackSection}>
        <div className={styles.feedbackHeaderRow}>
          <div className={styles.feedbackHeaderLeft}>
            <h2 className={styles.feedbackTitle}>Feedback khách hàng</h2>
            <p className={styles.feedbackSubtitle}>
              Chúng tôi đạt đánh giá từ khách hàng - <strong>4.9</strong> - trên
              5
            </p>
            <div className={styles.feedbackUnderline} />
          </div>
          <div className={styles.feedbackHeaderControls}>
            <button
              className={styles.feedbackHeaderArrow}
              aria-label="Xem thêm phản hồi"
              onClick={() => {
                const el = document.querySelector(
                  `.${styles.feedbackViewport}`
                );
                if (!el) return;
                el.scrollBy({ left: el.clientWidth * 0.8, behavior: "smooth" });
              }}
            >
              ↗
            </button>
          </div>
        </div>

        <div className={styles.feedbackViewport}>
          <div className={styles.feedbackTrack}>
            {feedback?.results?.map((fb, idx) => {
              const bg =
                fb?.userImg && fb.userImg.length > 0 ? fb.userImg[0].url : "";
              return (
                <div
                  className={styles.feedbackCardVisual}
                  key={idx}
                  style={{ backgroundImage: `url(${bg})` }}
                >
                  <div className={styles.feedbackCardOverlay}>
                    <div className={styles.feedbackStars}>★★★★★</div>
                    <div className={styles.feedbackContent}>
                      <h4 className={styles.feedbackName}>{fb?.username}</h4>
                      <p className={styles.feedbackComment}>“{fb?.comment}”</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <button
            className={`${styles.feedbackArrow} ${styles.feedbackArrowLeft}`}
            aria-label="Lùi lại"
            onClick={() => {
              const el = document.querySelector(`.${styles.feedbackViewport}`);
              if (!el) return;
              el.scrollBy({ left: -el.clientWidth * 0.8, behavior: "smooth" });
            }}
          >
            ‹
          </button>
          <button
            className={`${styles.feedbackArrow} ${styles.feedbackArrowRight}`}
            aria-label="Xem thêm"
            onClick={() => {
              const el = document.querySelector(`.${styles.feedbackViewport}`);
              if (!el) return;
              el.scrollBy({ left: el.clientWidth * 0.8, behavior: "smooth" });
            }}
          >
            ›
          </button>
        </div>
      </div>

      {/* Booking */}
      <div className={styles.bookingSection}>
        <div className={styles.bookingContainer}>
          <div className={styles.bookingImageSection}>
            <img
              src={facility1}
              alt="Chuyên gia tư vấn"
              className={styles.bookingImage}
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
