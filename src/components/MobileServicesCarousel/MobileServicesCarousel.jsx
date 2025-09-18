import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from "react";
import axios from "axios";
import styles from "./MobileServicesCarousel.module.css";
import {
  batchPreloadImages,
  fetchImageWithCache,
} from "../../utils/imageOptimization";

const MobileServicesCarousel = () => {
  const [services, setServices] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [visibleCount, setVisibleCount] = useState(1);
  const trackRef = useRef(null);

  const headers = useMemo(
    () => ({ Authorization: "TOKEN 2AuVTwbx241MuVxjqnlzUh73SEBPtuzk" }),
    []
  );

  // Ultra-fast services fetch with optimized image loading
  useEffect(() => {
    const fetchServiceData = async () => {
      try {
        const response = await axios.get(
          "https://api.baserow.io/api/database/rows/table/639961/?user_field_names=true",
          { headers, timeout: 3000 } // Faster timeout
        );

        const serviceData = response.data.results || [];

        // Process services with optimized image URLs
        const processedServices = await Promise.all(
          serviceData.map(async (service, index) => {
            const rawImageUrl = service.serviceImage?.[0]?.url;
            if (rawImageUrl) {
              try {
                // Use cached optimized URL for faster loading
                const optimizedImageUrl = await fetchImageWithCache(
                  `data:image/url,${rawImageUrl}`, // Create a data URL for caching
                  `service_image_${index}`,
                  {
                    timeout: 2000,
                    priority: index < 3 ? "high" : "low", // High priority for first 3 images
                    width: 300, // Mobile optimized size
                    height: 200,
                    quality: 85,
                    retries: 2,
                  }
                );
                return { ...service, optimizedImageUrl };
              } catch (error) {
                console.warn(
                  `Failed to optimize service image ${index}:`,
                  error
                );
                return { ...service, optimizedImageUrl: rawImageUrl };
              }
            }
            return service;
          })
        );

        setServices(processedServices);

        // Ultra-fast batch preload with concurrent loading
        const imageUrls = processedServices
          .map(
            (service) =>
              service.optimizedImageUrl || service.serviceImage?.[0]?.url
          )
          .filter(Boolean);

        if (imageUrls.length > 0) {
          batchPreloadImages(imageUrls, 4) // Load 4 images concurrently for speed
            .then(() => console.log("Service images ultra-fast preloaded"))
            .catch((error) =>
              console.warn("Some service images failed to preload:", error)
            );
        }
      } catch (error) {
        console.error("Error fetching service data:", error);
      }
    };
    fetchServiceData();
  }, [headers]);

  // Update visible count based on screen size
  useEffect(() => {
    const updateVisibleCount = () => {
      if (window.innerWidth <= 480) {
        setVisibleCount(1);
      } else if (window.innerWidth <= 768) {
        setVisibleCount(1);
      } else if (window.innerWidth <= 1024) {
        setVisibleCount(2);
      } else {
        setVisibleCount(3);
      }
    };

    updateVisibleCount();
    window.addEventListener("resize", updateVisibleCount);
    return () => window.removeEventListener("resize", updateVisibleCount);
  }, []);

  const displayedServices = useMemo(() => services.slice(0, 6), [services]);
  const extendedServices = useMemo(() => {
    if (displayedServices.length === 0) return [];
    return [...displayedServices, ...displayedServices.slice(0, visibleCount)];
  }, [displayedServices, visibleCount]);

  const nextSlide = useCallback(() => {
    if (!isTransitioning) return;
    setCurrentIndex((prev) => prev + 1);
  }, [isTransitioning]);

  const prevSlide = useCallback(() => {
    if (!isTransitioning) return;
    setCurrentIndex((prev) => prev - 1);
  }, [isTransitioning]);

  const handleTransitionEnd = useCallback(() => {
    if (currentIndex >= displayedServices.length) {
      setIsTransitioning(false);
      setCurrentIndex(0);
      setTimeout(() => setIsTransitioning(true), 50);
    } else if (currentIndex < 0) {
      setIsTransitioning(false);
      setCurrentIndex(displayedServices.length - 1);
      setTimeout(() => setIsTransitioning(true), 50);
    }
  }, [currentIndex, displayedServices.length]);

  // Auto-play
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 4000);

    return () => clearInterval(interval);
  }, [nextSlide]);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  if (displayedServices.length === 0) {
    return <div className={styles.loading}>Đang tải dịch vụ...</div>;
  }

  return (
    <div className={styles.servicesSection}>
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <div className={styles.headerRow}>
            <div className={styles.titleSection}>
              <h2 className={styles.sectionTitle}>Các dịch vụ làm đẹp</h2>
            </div>
            <button
              className={styles.scrollToTopBtn}
              onClick={scrollToTop}
              aria-label="Lên đầu trang"
            >
              <span className={styles.arrowIcon}>↗</span>
            </button>
          </div>
          <div className={styles.sectionUnderline}></div>
        </div>

        <div className={styles.carousel}>
          <button
            className={styles.navButton}
            onClick={prevSlide}
            aria-label="Dịch vụ trước"
          >
            ‹
          </button>

          <div className={styles.carouselContainer}>
            <div
              ref={trackRef}
              className={`${styles.carouselTrack} carousel-track`}
              style={{
                transform: `translateX(-${
                  currentIndex * (100 / visibleCount)
                }%)`,
                transition: isTransitioning
                  ? "transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
                  : "none",
                willChange: "transform",
                backfaceVisibility: "hidden",
              }}
              onTransitionEnd={handleTransitionEnd}
            >
              {extendedServices.map((service, index) => (
                <div
                  key={`${service.id}-${index}`}
                  className={styles.slideItem}
                  style={{ flex: `0 0 ${100 / visibleCount}%` }}
                >
                  <div className={styles.slideImage}>
                    <img
                      src={
                        service.optimizedImageUrl ||
                        service.serviceImage?.[0]?.url ||
                        ""
                      }
                      alt={service.title}
                      className={styles.serviceImg}
                      loading={index < 3 ? "eager" : "lazy"} // Eager loading for first 3 images
                      decoding="async"
                      fetchPriority={index < 3 ? "high" : "auto"} // High priority for visible images
                      style={{
                        transform: "translateZ(0)",
                        backfaceVisibility: "hidden",
                        imageRendering: "optimizeSpeed", // Faster rendering
                        willChange: "transform",
                      }}
                    />
                    <div className={styles.slideOverlay}>
                      <div className={styles.slideContent}>
                        <h3 className={styles.slideTitle}>{service.title}</h3>
                        {service.description && (
                          <p className={styles.slideDescription}>
                            {service.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            className={styles.navButton}
            onClick={nextSlide}
            aria-label="Dịch vụ tiếp theo"
          >
            ›
          </button>
        </div>

        {/* Dots indicator for mobile */}
        <div className={styles.dotsContainer}>
          {displayedServices.map((_, index) => (
            <button
              key={index}
              className={`${styles.dot} ${
                index === currentIndex % displayedServices.length
                  ? styles.activeDot
                  : ""
              }`}
              onClick={() => setCurrentIndex(index)}
              aria-label={`Đến slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MobileServicesCarousel;
