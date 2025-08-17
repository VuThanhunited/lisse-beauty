import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import BookingModal from "../../components/BookingModal/BookingModal";
import styles from "./Navbar.module.css";
import axios from "axios";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [logoUrl, setLogoUrl] = useState("");
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  const headers = useMemo(
    () => ({
      Authorization: "TOKEN 2AuVTwbx241MuVxjqnlzUh73SEBPtuzk",
    }),
    []
  );
  // Lấy banner
  useEffect(() => {
    const fetchBannerData = async () => {
      try {
        const response = await axios.get(
          "https://api.baserow.io/api/database/rows/table/639961/?user_field_names=true",
          { headers }
        );
        setLogoUrl(response.data.results[0]?.logo[0]?.url || "");
        console.log("Logo data fetched:", response.data.results);
      } catch (error) {
        console.error("Error fetching logo data:", error);
      }
    };
    fetchBannerData();
  }, [headers]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.navContainer}>
        {/* Left Navigation */}
        <div className={styles.navLeft}>
          <Link to="/brand-story" className={styles.navLink}>
            Câu chuyện thương hiệu
          </Link>
          <Link to="/beauty-knowledge" className={styles.navLink}>
            Kiến thức làm đẹp
          </Link>
        </div>

        {/* Logo Center */}
        <div className={styles.navLogo}>
          <Link to="/" className={styles.logo}>
            <img src={logoUrl} alt="logo" />
          </Link>
        </div>

        {/* Right Navigation */}
        <div className={styles.navRight}>
          <Link to="/services" className={styles.navLink}>
            Dịch vụ
          </Link>
          <Link to="/contact" className={styles.navLink}>
            Liên hệ
          </Link>
          <button
            className={styles.navBtn}
            onClick={() => setIsBookingOpen(true)}
          >
            ĐẶT LỊCH NGAY
          </button>
          {isBookingOpen && (
            <BookingModal
              isOpen={isBookingOpen}
              onClose={() => setIsBookingOpen(false)}
            />
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className={`${styles.menuToggle} ${isMenuOpen ? styles.active : ""}`}
          onClick={toggleMenu}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* Mobile Menu */}
        <div
          className={`${styles.mobileMenu} ${isMenuOpen ? styles.active : ""}`}
        >
          <Link
            to="/brand-story"
            className={styles.mobileLink}
            onClick={toggleMenu}
          >
            Câu chuyện thương hiệu
          </Link>
          <Link
            to="/beauty-knowledge"
            className={styles.mobileLink}
            onClick={toggleMenu}
          >
            Kiến thức làm đẹp
          </Link>
          <Link
            to="/services"
            className={styles.mobileLink}
            onClick={toggleMenu}
          >
            Dịch vụ
          </Link>
          <Link
            to="/contact"
            className={styles.mobileLink}
            onClick={toggleMenu}
          >
            Liên hệ
          </Link>
          <button
            className={styles.mobileBtn}
            onClick={() => {
              setIsBookingOpen(true);
              setIsMenuOpen(false);
            }}
          >
            ĐẶT LỊCH NGAY
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
