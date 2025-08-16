import styles from "./HomeContent.module.css";
import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import axios from "axios";
import facility1 from "../../../data/cơ sở vật chất-1.jpg";
import Footer from "../../../components/Footer/Footer";

// Before/After Slider Component
const BeforeAfterSlider = ({ beforeImage, afterImage, title }) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);

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

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleLocalMouseMove = (e) => {
    if (!isDragging) return;
    handleMouseMove(e);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return (
    <div className={styles.beforeAfterContainer}>
      <div
        ref={containerRef}
        className={styles.beforeAfterSlider}
        onMouseMove={handleLocalMouseMove}
        onMouseDown={handleMouseDown}
      >
        {/* Before Image */}
        <div className={styles.beforeImage}>
          <img src={beforeImage} alt={`${title} - Trước`} />
          <div className={styles.imageLabel}>TRƯỚC</div>
        </div>

        {/* After Image */}
        <div
          className={styles.afterImage}
          style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
        >
          <img src={afterImage} alt={`${title} - Sau`} />
          <div className={styles.imageLabel}>SAU</div>
        </div>

        {/* Slider Handle */}
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
      </div>

      <div className={styles.beforeAfterTitle}>
        <h3>{title}</h3>
      </div>
    </div>
  );
};

const HomeContent = () => {
  // State cho feedback
  const [feedback, setFeedback] = useState({ results: [] });
  const [currentSlide, setCurrentSlide] = useState(1); // Start from 1 (first real slide)
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [slideWidth, setSlideWidth] = useState(33.333);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [services, setServices] = useState([]);
  const headers = useMemo(
    () => ({
      Authorization: "TOKEN 2AuVTwbx241MuVxjqnlzUh73SEBPtuzk",
    }),
    []
  );

  // Lấy service
  useEffect(() => {
    const fetchServiceData = async () => {
      try {
        const response = await axios.get(
          "https://api.baserow.io/api/database/rows/table/639961/?user_field_names=true",
          { headers }
        );
        setServices(response.data.results || []);
        console.log("Service data fetched:", response.data.results);
      } catch (error) {
        console.error("Error fetching service data:", error);
      }
    };
    fetchServiceData();
  }, [headers]);

  // Lấy feedback
  useEffect(() => {
    const fetchFeedbackData = async () => {
      try {
        const response = await axios.get(
          "https://api.baserow.io/api/database/rows/table/644174/?user_field_names=true",
          { headers }
        );
        setFeedback(response.data);
        console.log("Feedback data fetched:", response.data);
      } catch (error) {
        console.error("Error fetching feedback data:", error);
      }
    };
    fetchFeedbackData();
  }, [headers]);
  // Create infinite loop by duplicating first and last slides
  // Chỉ lấy 4 service đầu tiên
  const displayedServices = services.slice(0, 4);
  // Tạo infinite loop nếu cần
  const extendedServices =
    displayedServices.length > 0
      ? [
          displayedServices[displayedServices.length - 1],
          ...displayedServices,
          displayedServices[0],
        ]
      : [];

  const nextSlide = () => {
    setCurrentSlide((prev) => prev + 1);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => prev - 1);
  };

  // Handle responsive slide width
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setSlideWidth(100);
      } else {
        setSlideWidth(33.333);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Handle infinite loop transitions
  useEffect(() => {
    if (currentSlide === 0) {
      // If at the duplicate last slide, jump to real last slide
      setTimeout(() => {
        setIsTransitioning(false);
        setCurrentSlide(services.length);
        requestAnimationFrame(() => {
          setIsTransitioning(true);
        });
      }, 600);
    } else if (currentSlide === extendedServices.length - 1) {
      // If at the duplicate first slide, jump to real first slide
      setTimeout(() => {
        setIsTransitioning(false);
        setCurrentSlide(1);
        requestAnimationFrame(() => {
          setIsTransitioning(true);
        });
      }, 600);
    }
  }, [currentSlide, services.length, extendedServices.length]);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlay) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => prev + 1);
    }, 4000); // Change slide every 4 seconds

    return () => clearInterval(interval);
  }, [isAutoPlay]);

  // Pause auto-play on hover
  const handleMouseEnter = () => setIsAutoPlay(false);
  const handleMouseLeave = () => setIsAutoPlay(true);

  return (
    <div className={styles.homeContent}>
      <div className={styles.servicesSection} id="services">
        <h2 className={styles.sectionTitle}>Các dịch vụ làm đẹp</h2>
        <div
          className={styles.carousel}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <button className={styles.prevBtn} onClick={prevSlide}>
            &#8249;
          </button>

          <div className={styles.carouselContainer}>
            <div
              className={styles.carouselTrack}
              style={{
                transform: `translateX(-${currentSlide * slideWidth}%)`,
                transition: isTransitioning
                  ? "transform 0.6s cubic-bezier(0.25, 0.1, 0.25, 1)"
                  : "none",
              }}
            >
              {extendedServices.map((service, index) => (
                <div
                  key={`${service.id}-${index}`}
                  className={styles.slideItem + " " + styles.customSlide}
                >
                  <div
                    className={
                      styles.slideImage + " " + styles.customSlideImage
                    }
                  >
                    <img
                      src={
                        service.serviceImage && service.serviceImage.length > 0
                          ? service.serviceImage[0].url
                          : ""
                      }
                      alt={service.title}
                      className={styles.slideImgRounded}
                    />
                    <div
                      className={
                        styles.slideOverlay + " " + styles.customSlideOverlay
                      }
                    >
                      <h3 className={styles.slideTitle}>{service.title}</h3>
                      <p className={styles.slideDescription}>
                        {service.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button className={styles.nextBtn} onClick={nextSlide}>
            &#8250;
          </button>
        </div>
      </div>

      <div className={styles.lisseBeautyFacilitiesSection}>
        <h2 className={styles.sectionTitle}>Cơ sở vật chất tại Lisse Beauty</h2>
        <div className={styles.kimlyFacilitiesContainer}>
          {/* Hiển thị ảnh facility từ API, lấy từ service đầu tiên có facilityImg */}
          {services[0] &&
          services[0].facilityImg &&
          services[0].facilityImg.length > 0 ? (
            <>
              <div className={styles.mainFacilityImage}>
                <img
                  src={services[0].facilityImg[0].url}
                  alt="Phòng điều trị chính Lisse Beauty"
                />
              </div>
              <div className={styles.facilityThumbnails}>
                {services[0].facilityImg.slice(1, 5).map((img, idx) => (
                  <div className={styles.thumbnailItem} key={idx}>
                    <img src={img.url} alt={`Cơ sở vật chất ${idx + 2}`} />
                  </div>
                ))}
              </div>
            </>
          ) : null}
        </div>
      </div>
      {/* Câu chuyện khách hàng */}
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

      {/* Hero Section with Before/After Slider */}
      <div className={styles.heroSection}>
        <div className={styles.heroOverlay}>
          <h1 className={styles.heroTitle}>
            Mỗi khách hàng đều là{" "}
            <span className={styles.scriptText}>đại sứ thương hiệu</span>
          </h1>
        </div>

        <div
          className={styles.heroCarousel}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <button className={styles.heroPrevBtn} onClick={prevSlide}>
            &#8249;
          </button>

          <div className={styles.heroCarouselContainer}>
            <div
              className={styles.heroCarouselTrack}
              style={{
                transform: `translateX(-${currentSlide * slideWidth}%)`,
                transition: isTransitioning
                  ? "transform 0.6s cubic-bezier(0.25, 0.1, 0.25, 1)"
                  : "none",
              }}
            >
              {extendedServices.map((service, index) => (
                <div
                  key={`${service.id}-${index}`}
                  className={styles.heroSlideItem}
                >
                  <BeforeAfterSlider
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
                  />
                </div>
              ))}
            </div>
          </div>

          <button className={styles.heroNextBtn} onClick={nextSlide}>
            &#8250;
          </button>

          {/* Dots indicator */}
          <div className={styles.dotsContainer}>
            {services.map((_, index) => (
              <button
                key={index}
                className={`${styles.dot} ${
                  currentSlide === index + 1 ? styles.activeDot : ""
                }`}
                onClick={() => setCurrentSlide(index + 1)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Feedback Section */}
      <div className={styles.feedbackSection}>
        <h2 className={styles.sectionTitle}>Feedback khách hàng</h2>
        <p className={styles.sectionSubtitle}>
          Chúng tôi tự hào về đánh giá từ khách hàng - 4.8★ trên 5 sao
        </p>
        <div className={styles.feedbackGrid}>
          {feedback &&
            feedback.results &&
            feedback.results.map((fb, idx) => (
              <div className={styles.feedbackCard} key={idx}>
                <div className={styles.feedbackHeader}>
                  <div className={styles.customerInfo}>
                    <img
                      src={
                        fb.userImg && fb.userImg.length > 0
                          ? fb.userImg[0].url
                          : ""
                      }
                      alt={fb.username}
                      className={styles.customerAvatar}
                    />
                    <div>
                      <h4>{fb.username}</h4>
                      <div className={styles.starRating}>
                        <span>★★★★★</span>
                      </div>
                    </div>
                  </div>
                </div>
                <p className={styles.feedbackText}>{fb.comment}</p>
              </div>
            ))}
        </div>
      </div>

      {/* Booking Appointment Section */}
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
