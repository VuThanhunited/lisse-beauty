import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMessage, faCalendarDay, faPhone } from "@fortawesome/free-solid-svg-icons";
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
            <FontAwesomeIcon className={styles.icon} icon={faMessage} />
          </div>
          <span className={styles.tooltip}>Liên hệ</span>
        </div>

        {/* Booking/Calendar */}
        <div className={styles.iconItem} onClick={handleBooking}>
          <div className={styles.iconButton}>
            <FontAwesomeIcon className={styles.icon} icon={faCalendarDay} />
          </div>
          <span className={styles.tooltip}>Đặt lịch</span>
        </div>

        {/* Phone */}
        <div className={styles.iconItem} onClick={handleCall}>
          <div className={styles.iconButton}>
            <FontAwesomeIcon className={styles.icon} icon={faPhone} />
          </div>
          <span className={styles.tooltip}>Gọi ngay</span>
        </div>
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
