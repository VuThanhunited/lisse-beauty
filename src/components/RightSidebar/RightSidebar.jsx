import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./RightSidebar.module.css";
import BookingModal from "../BookingModal/BookingModal";

const RightSidebar = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;

      // Show sidebar after scrolling 100px
      if (scrollTop > 100) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleCall = () => {
    window.open("tel:+84123456789", "_self");
  };

  const handleBooking = () => {
    // Show booking modal instead of navigating
    console.log("Booking button clicked!");
    setIsBookingModalOpen(true);
    console.log("Modal state set to:", true);
  };

  return (
    <>
      <div
        className={`${styles.rightSidebar} ${isVisible ? styles.visible : ""}`}
      >
        {/* Chat/Contact */}
        <div
          className={styles.iconItem}
          onClick={() => handleNavigation("/contact")}
        >
          <div className={styles.iconButton}>
            <svg
              className={styles.icon}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
          </div>
          <span className={styles.tooltip}>Liên hệ</span>
        </div>

        {/* Booking/Calendar */}
        <div className={styles.iconItem} onClick={handleBooking}>
          <div className={styles.iconButton}>
            <svg
              className={styles.icon}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
          </div>
          <span className={styles.tooltip}>Đặt lịch</span>
        </div>

        {/* Phone */}
        <div className={styles.iconItem} onClick={handleCall}>
          <div className={styles.iconButton}>
            <svg
              className={styles.icon}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
            </svg>
          </div>
          <span className={styles.tooltip}>Gọi ngay</span>
        </div>

        {/* Back to Top */}
      </div>

      {/* Booking Modal - Render outside of sidebar for proper z-index */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
      />
    </>
  );
};

export default RightSidebar;
