import styles from "./HomeContent.module.css";
import { useState, useEffect, useCallback, useRef } from "react";

// Service carousel images (for "Các dịch vụ làm đẹp" section)
import serviceImg1 from "../../../data/518342647_122120769032891459_4219618419434067516_n.jpg";
import serviceImg2 from "../../../data/518375107_122120771042891459_3218480619733617655_n.jpg";
import serviceImg3 from "../../../data/518600115_122120764574891459_5021028668652265494_n.jpg";
import serviceImg4 from "../../../data/520240366_122120843918891459_7638784159492956398_n.jpg";

// Before/After images for hero slider
import beforeImg1 from "../../../data/left_image.jpg";
import beforeImg2 from "../../../data/left_image2.jpg";
import beforeImg3 from "../../../data/left_image3.jpg";
import beforeImg4 from "../../../data/left_image3.jpg";

// After images for hero slider (enhanced results)
import afterImg1 from "../../../data/right_image.jpg";
import afterImg2 from "../../../data/right_image2.jpg";
import afterImg3 from "../../../data/right_image3.jpg";
import afterImg4 from "../../../data/right_image3.jpg";

// Facility images
import facility1 from "../../../data/cơ sở vật chất-1.jpg";
import facility2 from "../../../data/cơ sở vật chất 2.jpg";
import facility3 from "../../../data/cơ sở vật chất 3.jpg";

// Customer story images
import customerImg1 from "../../../data/khách hàng 1.jpg";
import customerImg2 from "../../../data/khách hàng 2.jpg";
import customerImg3 from "../../../data/khách hàng 3.jpg";

// Feedback customer avatars
import feedbackAvatar1 from "../../../data/520382423_122120854712891459_6189393590492377467_n.jpg";
import feedbackAvatar2 from "../../../data/523400147_122123835236891459_4245426327108376588_n.jpg";
import feedbackAvatar3 from "../../../data/profile1.jpg";

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
  const [currentSlide, setCurrentSlide] = useState(1); // Start from 1 (first real slide)
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [slideWidth, setSlideWidth] = useState(33.333);
  const [isTransitioning, setIsTransitioning] = useState(true);

  const services = [
    {
      id: 1,
      title: "Foxbrows",
      serviceImage: serviceImg1, // For carousel display
      beforeImage: beforeImg1, // For before/after slider
      afterImage: afterImg1, // For before/after slider
      description: "Phun xăm chân mày tự nhiên, nâng tầm vẻ đẹp của bạn",
    },
    {
      id: 2,
      title: "Hair stroke",
      serviceImage: serviceImg2,
      beforeImage: beforeImg2,
      afterImage: afterImg2,
      description: "Kỹ thuật vẽ từng sợi lông mày siêu tự nhiên",
    },
    {
      id: 3,
      title: "Sketchlips",
      serviceImage: serviceImg3,
      beforeImage: beforeImg3,
      afterImage: afterImg3,
      description: "Phun xăm môi gradient tự nhiên, bền màu",
    },
    {
      id: 4,
      title: "Beauty Care",
      serviceImage: serviceImg4,
      beforeImage: beforeImg4,
      afterImage: afterImg4,
      description: "Chăm sóc da chuyên nghiệp, an toàn",
    },
  ];

  // Create infinite loop by duplicating first and last slides
  const extendedServices = [
    services[services.length - 1], // Last slide at the beginning
    ...services,
    services[0], // First slide at the end
  ];

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
                  className={styles.slideItem}
                >
                  <div className={styles.slideImage}>
                    <img src={service.serviceImage} alt={service.title} />
                    <div className={styles.slideOverlay}>
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
          <div className={styles.mainFacilityImage}>
            <img src={facility1} alt="Phòng điều trị chính Lisse Beauty" />
          </div>
          <div className={styles.facilityThumbnails}>
            <div className={styles.thumbnailItem}>
              <img src={facility2} alt="Khu vực chờ sang trọng" />
            </div>
            <div className={styles.thumbnailItem}>
              <img src={facility3} alt="Phòng tư vấn riêng tư" />
            </div>
            <div className={styles.thumbnailItem}>
              <img src={facility1} alt="Thiết bị hiện đại" />
            </div>
            <div className={styles.thumbnailItem}>
              <img src={facility2} alt="Không gian thư giãn" />
            </div>
          </div>
        </div>
      </div>
      {/* Câu chuyện khách hàng */}
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
                    Chúng ta mất 15 phút mỗi sáng để kẻ lông mày, thật là lãng
                    phí
                  </p>
                  <button className={styles.viewMoreButton}>Xem thêm</button>
                </div>
              </div>
            </div>
          </div>

          {/* Story Card 2 */}
          <div className={styles.storyCard}>
            <div className={styles.storyImageWrapper}>
              <img src={customerImg2} alt="Câu chuyện khách hàng 2" />
              <div className={styles.storyOverlay}>
                <div className={styles.storyContent}>
                  <h3>Tự tin hơn mỗi ngày</h3>
                  <p>
                    Lông mày đẹp tự nhiên giúp tôi tự tin hơn trong cuộc sống
                  </p>
                  <button className={styles.viewMoreButton}>Xem thêm</button>
                </div>
              </div>
            </div>
          </div>

          {/* Story Card 3 */}
          <div className={styles.storyCard}>
            <div className={styles.storyImageWrapper}>
              <img src={customerImg3} alt="Câu chuyện khách hàng 3" />
              <div className={styles.storyOverlay}>
                <div className={styles.storyContent}>
                  <h3>Không còn lo lắng</h3>
                  <p>Kết quả hoàn hảo vượt ngoài mong đợi của tôi</p>
                  <button className={styles.viewMoreButton}>Xem thêm</button>
                </div>
              </div>
            </div>
          </div>
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
                    beforeImage={service.beforeImage}
                    afterImage={service.afterImage}
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
          <div className={styles.feedbackCard}>
            <div className={styles.feedbackHeader}>
              <div className={styles.customerInfo}>
                <img
                  src={feedbackAvatar1}
                  alt="Khách hàng"
                  className={styles.customerAvatar}
                />
                <div>
                  <h4>Nguyễn Minh Anh</h4>
                  <div className={styles.starRating}>
                    <span>★★★★★</span>
                  </div>
                </div>
              </div>
            </div>
            <p className={styles.feedbackText}>
              "Dịch vụ foxbrows tại Lisse Beauty thật tuyệt vời! Kỹ thuật viên
              rất chuyên nghiệp, chân mày tôi trông tự nhiên và đẹp hơn rất
              nhiều. Tôi rất hài lòng!"
            </p>
          </div>

          <div className={styles.feedbackCard}>
            <div className={styles.feedbackHeader}>
              <div className={styles.customerInfo}>
                <img
                  src={feedbackAvatar2}
                  alt="Khách hàng"
                  className={styles.customerAvatar}
                />
                <div>
                  <h4>Trần Thu Hương</h4>
                  <div className={styles.starRating}>
                    <span>★★★★★</span>
                  </div>
                </div>
              </div>
            </div>
            <p className={styles.feedbackText}>
              "Hair stroke technique ở đây quá xuất sắc! Từng sợi lông mày được
              vẽ rất tỉ mỉ, tự nhiên như thật. Không gian spa cũng sang trọng và
              sạch sẽ."
            </p>
          </div>

          <div className={styles.feedbackCard}>
            <div className={styles.feedbackHeader}>
              <div className={styles.customerInfo}>
                <img
                  src={feedbackAvatar3}
                  alt="Khách hàng"
                  className={styles.customerAvatar}
                />
                <div>
                  <h4>Lê Lan Phương</h4>
                  <div className={styles.starRating}>
                    <span>★★★★★</span>
                  </div>
                </div>
              </div>
            </div>
            <p className={styles.feedbackText}>
              "Sketchlips tại Lisse Beauty thật tuyệt! Màu môi rất tự nhiên và
              bền đẹp. Nhân viên tư vấn chu đáo, quy trình thực hiện an toàn và
              chuyên nghiệp."
            </p>
          </div>
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
