import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import classes from "./Header.module.css";

const Header = () => {
  const [bannerUrl, setBannerUrl] = useState("");
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
        setBannerUrl(response.data.results[0]?.banner[0]?.url || "");
        console.log("Banner data fetched:", response.data.results);
      } catch (error) {
        console.error("Error fetching banner data:", error);
      }
    };
    fetchBannerData();
  }, [headers]);
  return (
    <header className={classes.header}>
      {/* Background Image */}
      <div
        className={classes.backgroundImage}
        style={{ backgroundImage: `url(${bannerUrl})` }}
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
            <h4 className={classes.serviceTitle}>Danh giá dịch vụ</h4>
            <p className={classes.serviceDesc}>
              Chúng tôi muốn nghe từ bạn nhiều hơn để có thể hiển hiện dịch vụ
              của chúng tôi
            </p>
            <div className={classes.serviceIcons}>
              <span>👍</span>
              <span>👍</span>
              <span>👍</span>
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
