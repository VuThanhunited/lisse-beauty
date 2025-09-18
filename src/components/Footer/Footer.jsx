import { useState, useEffect, useMemo } from "react";
import styles from "./Footer.module.css";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebookF,
  faInstagram,
  faTiktok,
} from "@fortawesome/free-brands-svg-icons";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

const Footer = () => {
  const [logoUrl, setLogoUrl] = useState("");
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
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContainer}>
        <div className={styles.footerColumn}>
          <img src={logoUrl} alt="logo" />
          <p>
            Tại KIMLY, chúng tôi cam kết tạo nên sự khác biệt không chỉ qua từng
            dịch vụ phun xăm môi cao cấp chính hãng mà còn qua cách chúng tôi
            tương tác với mỗi khách hàng và nhân viên. Chúng tôi tin rằng vẻ đẹp
            thật sự bắt nguồn từ bên trong và tỏa sáng ra bên ngoài thông qua sự
            chăm sóc và chuyên nghiệp.
          </p>
          <div className={styles.socialLinks}>
            <Link
              to="https://www.facebook.com/profile.php?id=61576743783774&sk=about"
              aria-label="Facebook"
            >
              <div className={styles.socialIcon}>
                <FontAwesomeIcon icon={faFacebookF} />
              </div>
            </Link>
            <Link href="#" aria-label="Instagram">
              <div className={styles.socialIcon}>
                <FontAwesomeIcon icon={faInstagram} />
              </div>
            </Link>
            <Link href="#" aria-label="TikTok">
              <div className={styles.socialIcon}>
                <FontAwesomeIcon icon={faTiktok} />
              </div>
            </Link>
            <Link href="#" aria-label="Threads">
              <div className={styles.socialIcon}>@</div>
            </Link>
          </div>
        </div>

        {/* <div className={styles.footerColumn}>
          <h4>HAIRSTROKE</h4>
          <ul>
            <li>SKETCHLIPS</li>
            <li>BERRY LIPS</li>
          </ul>
        </div>

        <div className={styles.footerColumn}>
          <h4>GLOWING</h4>
          <ul>
            <li>SỞ SIÊU THỰC</li>
            <li>ƯU ĐÃI</li>
          </ul>
        </div> */}

        <div className={styles.footerColumn}>
          <div className={styles.servicesSection}>
            <div>
              <ul>
                <li>HAIRSTROKE</li>
                <li>SKETCHLIPS</li>
                <li>BERRY LIPS</li>
              </ul>
            </div>
            <div>
              <ul>
                <li>GLOWING</li>
                <li>SỞ SIÊU THỰC</li>
                <li>ƯU ĐÃI</li>
              </ul>
            </div>
          </div>
          <div className={styles.contactSection}>
            <div className={styles.pageLink}>
              <Link to="/brand-story" className={styles.navLink}>
                Câu chuyện thương hiệu
              </Link>
              <Link to="/beauty-knowledge" className={styles.navLink}>
                Kiến thức làm đẹp
              </Link>
              <Link to="/services" className={styles.navLink}>
                Dịch vụ
              </Link>
              <Link to="/contact" className={styles.navLink}>
                Liên hệ
              </Link>
            </div>
            <div className={styles.contactInfo}>
              <h4>Hotline</h4>
              <p>0123 456 789</p>
              <h4>Email</h4>
              <p>lissebeauty@gmail.com</p>
            </div>
            <div className={styles.contactBtn}>
              <FontAwesomeIcon
                icon={faLocationDot}
                style={{ marginRight: "5px" }}
              />
              Có sẵn gần bạn!
            </div>
          </div>
        </div>
      </div>

      <div className={styles.footerBottom}>
        <p>© 2025 LISSE. All right reserved.</p>
        <div className={styles.footerLinks}>
          <Link href="#">Privacy Policy</Link>
          <span>|</span>
          <Link href="#">Terms & Conditions</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
