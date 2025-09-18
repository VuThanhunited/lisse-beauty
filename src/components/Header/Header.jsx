import { useState, useEffect, useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import classes from "./Header.module.css";

const Header = () => {
  const [bannerUrl, setBannerUrl] = useState("");
  const [mobileBannerUrl, setMobileBannerUrl] = useState("");
  const [isMobile, setIsMobile] = useState(false);

  const headers = useMemo(
    () => ({
      Authorization: "TOKEN 2AuVTwbx241MuVxjqnlzUh73SEBPtuzk",
    }),
    []
  );

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Lấy banner
  useEffect(() => {
    const fetchBannerData = async () => {
      try {
        const response = await axios.get(
          "https://api.baserow.io/api/database/rows/table/639961/?user_field_names=true",
          { headers }
        );
        const data = response.data.results[0];
        setBannerUrl(data?.banner[0]?.url || "");
        setMobileBannerUrl(data?.banner[1]?.url || "");
        console.log("Banner data fetched:", response.data.results);
        console.log("Desktop banner URL:", data?.banner[0]?.url);
        console.log("Mobile banner URL:", data?.["banner-mobile"]?.[0]?.url);
      } catch (error) {
        console.error("Error fetching banner data:", error);
      }
    };
    fetchBannerData();
  }, [headers]);

  const currentBannerUrl = isMobile ? mobileBannerUrl : bannerUrl;

  console.log("Current state:", {
    isMobile,
    bannerUrl,
    mobileBannerUrl,
    currentBannerUrl,
    windowWidth: window.innerWidth,
  });

  return (
    <header className={classes.header}>
      {/* Desktop Background Image */}
      <div
        className={`${classes.backgroundImage} ${classes.desktopBanner}`}
        style={{ backgroundImage: `url(${bannerUrl})` }}
      ></div>

      {/* Mobile Background Image */}
      <div
        className={`${classes.backgroundImage} ${classes.mobileBanner}`}
        style={{ backgroundImage: `url(${mobileBannerUrl})` }}
      ></div>

      {/* Bottom Cards Section */}
      <div className={classes.bottomSection}>
        <div className={classes.cardsContainer}>
          {/* Booking Form */}
          <div className={classes.bookingCard}>
            <h3 className={classes.cardTitle}>Bạn thắc mắc điều gì</h3>
            <div className={classes.formGroup}>
              <input
                type="text"
                placeholder="Nhập tên của bạn"
                className={classes.formInput}
              />
            </div>
            <div className={classes.formGroup}>
              <input
                type="tel"
                placeholder="Số điện thoại"
                className={classes.formInput}
              />
            </div>
            <button className={classes.submitBtn}>TƯ VẤN LÀM ĐẸP →</button>
          </div>

          {/* Service Info Card */}
          <div className={classes.serviceCard}>
            <h4 className={classes.serviceTitle}>Đánh giá dịch vụ</h4>
            <p className={classes.serviceDesc}>
              Chúng tôi muốn nghe từ bạn nhiều hơn để có thể hiển hiện dịch vụ
              của chúng tôi
            </p>
            <div className={classes.serviceIcons}>
              <FontAwesomeIcon icon={faThumbsUp} />
              <FontAwesomeIcon icon={faThumbsUp} />
              <FontAwesomeIcon icon={faThumbsUp} />
            </div>
          </div>

          {/* Gentle Care Card */}
          <div className={classes.gentleCard}>
            <div className={classes.gentleText}>
              <span className={classes.animatedText}>Nhẹ nhàng</span>
              <span className={classes.animatedText}>Tinh tế</span>
              <span className={classes.animatedText}>Tự nhiên</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
