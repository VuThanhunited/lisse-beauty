import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import styles from "./GlowingBrowDetail.module.css";

// Import images
import glowingBrowImg from "../../data/518600115_122120764574891459_5021028668652265494_n.jpg";
import hairstrokeImg from "../../data/519421760_122120777714891459_5490134016365387672_n.jpg";

const GlowingBrowDetail = () => {
  const navigate = useNavigate();
  const [expandedFAQ, setExpandedFAQ] = useState(null);

  const toggleFAQ = (index) => {
    setExpandedFAQ(expandedFAQ === index ? null : index);
  };

  const faqData = [
    {
      question: "Glowing Brow có đau không?",
      answer:
        "Không. Công nghệ tiêm chân may tự nhiên với kỹ thuật chính mì cho không gây đau đớn. Bạn sẽ cảm thấy rất thoải mái trong suốt quá trình.",
    },
    {
      question: "Làm xong bao lâu bình?",
      answer:
        "Thời gian phục hồi từ 5-7 ngày. Khách hàng có thể lên cân thường xuyên và thay màu chấn đài mày chấm.",
    },
    {
      question: "Có bị mù màu lườm thải kỳ và không?",
      answer:
        "Không. Mày được dùng là máy xây đài, nó tính hiện tại từ tháng tới trong thời kỳ.",
    },
    {
      question: "Bao lâu thì các cần?",
      answer:
        "Thời gian để có kết quả hoàn thiện là 10 ngày, sau đó lên măng thay thay thường giam kỳ.",
    },
  ];

  return (
    <div className={styles.glowingBrowDetailPage}>
      <Navbar />

      {/* Hero Section */}
      <div className={styles.heroSection}>
        <div className={styles.container}>
          <div className={styles.heroContent}>
            <div className={styles.heroImage}>
              <img src={glowingBrowImg} alt="Glowing Brow" />
            </div>
            <div className={styles.heroInfo}>
              <div className={styles.serviceTag}>Dịch vụ</div>
              <h1>Glowing Brow</h1>
              <div className={styles.contactInfo}>
                <div className={styles.contactItem}>
                  <span className={styles.icon}>📞</span>
                  <span>0896 397 357</span>
                </div>
                <div className={styles.contactItem}>
                  <span className={styles.icon}>✉️</span>
                  <span>kimlyeyebrows@gmail.com</span>
                </div>
                <div className={styles.contactItem}>
                  <span className={styles.icon}>📍</span>
                  <span>
                    Hồ gần văn xá
                    <br />
                    10 nhóm đếm 20mhp tháng nghỉ
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={styles.mainContent}>
        <div className={styles.container}>
          {/* Introduction */}
          <div className={styles.introSection}>
            <h2>
              Glowing Brow là gì? Giải pháp chăn máy tự nhiên, nhẹ nhàng, sắc
              nét không lo dậu phần xăm Bön
            </h2>
            <p>
              <strong>
                Bạn muốn có các chấn mày nào quá tự nhiên đẹp - không cứng - tò
                hiểu đều?
              </strong>
              <br />
              Bạn sợ rực rỡ và cộng các vấn đề - đồ mầu - hậu tết xời được thật
              không?
            </p>
            <p>
              <strong>Glowing Brow</strong> là côg s ở tương tính đo tại - mời
              tự nà hành phản chấn mày nhẹ hỏa nòn và cứa nghệ Beauty.
            </p>

            <h3>Glowing Brow là gì?</h3>
            <p>
              <strong>Glowing Brow</strong> gì trong pháp phần chấn mày, hiểu
              đài, có swing tết thiệt hèt thời thì các cứa nghĩa rằm cầm chia
              lôp rây thân. Thay vì bơ hệ hợp cả liễu thăng; Glowing Brow đấm
              bàng véo hệ tại bạn trong cây riệng rợp hình của các thang chúc
              mong-xem ở có kỹ.
            </p>

            <div className={styles.highlight}>
              ❤️ Glowing Brow tỏn trong tại Việt chế máy học - kiểu hỗ tạ âm;
              này khi hiệu để, sẽ này thì người dý vào hiện các hành hóc.
            </div>
          </div>

          {/* Benefits Section */}
          <div className={styles.benefitsSection}>
            <h3>Glowing Brow phù hợp với ai?</h3>
            <ul className={styles.benefitsList}>
              <li>
                Người có <strong>lông mày thưa, mất tính</strong>, không cao
                nhưng.
              </li>
              <li>
                Người muốn phần <strong>cân bằng hồng</strong> có kệ tự dục hỷ
                "gỗ".
              </li>
              <li>
                Hào sinh với việc tỷa gẳng, người cần với nhuộm trong dài qua
                các cải để nhiện.
              </li>
              <li>
                Không gỗ có phương thờn <strong>"xem gài"</strong>, như thường -
                hiến đề - không gương nò.
              </li>
            </ul>
          </div>

          {/* Advantages Section */}
          <div className={styles.advantagesSection}>
            <h3>Ưu điểm nổi bật của Glowing Brow tại KIMLY Beauty</h3>
            <div className={styles.advantageGrid}>
              <div className={styles.advantageItem}>
                <h4>Đàc điểm</h4>
              </div>
              <div className={styles.advantageItem}>
                <h4>Lợi ích mang lại</h4>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className={styles.faqSection}>
            <h3>Câu hỏi thường gặp (FAQ)</h3>
            <div className={styles.faqList}>
              {faqData.map((faq, index) => (
                <div key={index} className={styles.faqItem}>
                  <button
                    className={styles.faqQuestion}
                    onClick={() => toggleFAQ(index)}
                  >
                    <span>{faq.question}</span>
                    <span
                      className={`${styles.faqIcon} ${
                        expandedFAQ === index ? styles.expanded : ""
                      }`}
                    >
                      ▼
                    </span>
                  </button>
                  {expandedFAQ === index && (
                    <div className={styles.faqAnswer}>
                      <p>{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Why Choose Section */}
          <div className={styles.whyChooseSection}>
            <h3>
              Lý do Glowing Brow là lựa chọn tốt ưu cho thầy đeò "đẹp tự nhiên"
            </h3>
            <p>
              Trong nhiều kỹ thuật làm đẹp chăng mày, người đáng Glowing tềm lên
              hiên câm; nhiều nó này có
              <strong> mát hậu pháp phốp hợp vải phương cách súng</strong>
            </p>
            <p>Glowing Brow tính túc là đề có đối.</p>
            <ul className={styles.reasonsList}>
              <li>
                Người muốn <strong>tại nhiên nhắng có đều</strong>
              </li>
              <li>
                Người muốn chể <strong>thường kỉng gỗ hướng</strong>
              </li>
              <li>
                Người muốn nhẹ <strong>thường tào cả đăng cốp</strong>
              </li>
            </ul>
          </div>

          {/* Related Articles */}
          <div className={styles.relatedSection}>
            <h3>Bài viết liên quan</h3>
            <div className={styles.relatedGrid}>
              <div
                className={styles.relatedCard}
                onClick={() => navigate("/beauty-knowledge/hairstroke")}
              >
                <div className={styles.relatedImage}>
                  <img src={hairstrokeImg} alt="Hairstroke" />
                </div>
                <div className={styles.relatedContent}>
                  <h4>Hairstroke</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default GlowingBrowDetail;
