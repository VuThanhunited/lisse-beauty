import React from "react";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebookF,
  faInstagram,
  faTiktok,
} from "@fortawesome/free-brands-svg-icons";
import {
  faPhone,
  faEnvelope,
  faClock,
} from "@fortawesome/free-solid-svg-icons";
import styles from "./Contact.module.css";

const Contact = () => {
  return (
    <div className="contact-page">
      <Navbar />

      {/* Hero Banner */}
      <div className={styles.heroBanner}>
        <div className={styles.heroOverlay}>
          <h1 className={styles.heroTitle}>Liên hệ</h1>
        </div>
      </div>

      <div className={styles.contactPage}>
        <div className={styles.container}>
          <div className={styles.contactContent}>
            {/* Left side - Contact Info */}
            <div className={styles.contactInfo}>
              <h2 className={styles.contactTitle}>Thông tin liên hệ</h2>

              <div className={styles.infoCard}>
                <div className={styles.infoIcon}>
                  <FontAwesomeIcon icon={faPhone} />
                </div>
                <div className={styles.infoDetails}>
                  <p className={styles.infoLabel}>0886 357 357</p>
                </div>
              </div>

              <div className={styles.infoCard}>
                <div className={styles.infoIcon}>
                  <FontAwesomeIcon icon={faEnvelope} />
                </div>
                <div className={styles.infoDetails}>
                  <p className={styles.infoLabel}>kimlyeyebrows@gmail.com</p>
                </div>
              </div>

              <div className={styles.infoCard}>
                <div className={styles.infoIcon}>
                  <FontAwesomeIcon icon={faClock} />
                </div>
                <div className={styles.infoDetails}>
                  <p className={styles.infoSubtitle}>Thời gian làm việc</p>
                  <p className={styles.infoLabel}>
                    Từ 9h00 đến 20h00 hàng ngày
                  </p>
                </div>
              </div>

              <div className={styles.socialSection}>
                <h3 className={styles.socialTitle}>Theo dõi chúng tôi tại</h3>
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
            </div>

            {/* Right side - Contact Form */}
            <div className={styles.contactForm}>
              <h2 className={styles.formTitle}>Bạn đang thắc mắc điều gì?</h2>
              <p className={styles.formSubtitle}>
                Hãy để chúng mình tư vấn cho bạn
              </p>

              <form className={styles.form}>
                <div className={styles.formGroup}>
                  <input
                    type="text"
                    placeholder="Nhập tên của bạn"
                    className={styles.formInput}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <input
                    type="tel"
                    placeholder="Số điện thoại"
                    className={styles.formInput}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <textarea
                    placeholder="Nội dung tin nhắn"
                    rows="6"
                    className={styles.formTextarea}
                    required
                  ></textarea>
                </div>

                <button type="submit" className={styles.submitButton}>
                  ĐẶT LỊCH ĐỂ ĐƯỢC TƯ VẤN NGAY →
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Contact;
