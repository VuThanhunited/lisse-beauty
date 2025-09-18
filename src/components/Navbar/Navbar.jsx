import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import styles from "./Navbar.module.css";
import BookingModal from "../BookingModal/BookingModal";
import axios from "axios";
import { fetchImageWithCache } from "../../utils/imageOptimization";

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
  // Ultra-fast logo loading with optimized caching
  useEffect(() => {
    const loadLogo = async () => {
      try {
        const logoUrl = await fetchImageWithCache(
          "https://api.baserow.io/api/database/rows/table/639961/?user_field_names=true",
          "navbar_logo",
          {
            timeout: 3000, // Faster timeout
            priority: "high",
            expiry: 20 * 60 * 1000, // 20 minutes - longer cache
            retries: 3, // More retries
            width: 150, // Optimized size
            height: 50,
            quality: 90, // High quality for logo
            fetchOptions: { headers },
          }
        );

        setLogoUrl(logoUrl);
        console.log("Logo loaded with ultra-fast optimization");
      } catch (error) {
        console.error("Error loading logo:", error);
        // Ultra-fast fallback with direct axios call
        try {
          const response = await axios.get(
            "https://api.baserow.io/api/database/rows/table/639961/?user_field_names=true",
            {
              headers,
              timeout: 2000, // Very fast timeout for fallback
            }
          );
          const fallbackUrl = response.data.results[0]?.logo[0]?.url || "";
          if (fallbackUrl) {
            setLogoUrl(fallbackUrl);
          }
        } catch (fallbackError) {
          console.error("Fallback logo loading also failed:", fallbackError);
        }
      }
    };

    loadLogo();
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
            <img
              src={logoUrl}
              alt="logo"
              loading="eager"
              decoding="async"
              fetchPriority="high"
              style={{
                width: "auto",
                height: "40px",
                maxWidth: "80px",
                objectFit: "contain",
                transform: "translateZ(0)",
                backfaceVisibility: "hidden",
              }}
            />
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
