import React, { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./Navbar.module.css";
import logo from "../../data/logo.jpg"; // Adjust the path as necessary

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
            <img src={logo} alt="logo" />
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
          <Link to="/booking" className={styles.navBtn}>
            ĐẶT LỊCH NGAY
          </Link>
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
          <Link to="/booking" className={styles.mobileBtn} onClick={toggleMenu}>
            ĐẶT LỊCH NGAY
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
