import classes from "./Header.module.css";
import banner from "../../data/banner.jpg";

const Header = () => {
  return (
    <header className={classes.header}>
      {/* Background Image */}
      <div
        className={classes.backgroundImage}
        style={{ backgroundImage: `url(${banner})` }}
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
