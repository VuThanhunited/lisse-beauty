import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import styles from "./HairstrokeDetail.module.css";

// Import images
import hairstrokeImg from "../../data/519421760_122120777714891459_5490134016365387672_n.jpg";
import glowingBrowImg from "../../data/518600115_122120764574891459_5021028668652265494_n.jpg";

const HairstrokeDetail = () => {
  const navigate = useNavigate();
  const [expandedFAQ, setExpandedFAQ] = useState(null);

  const toggleFAQ = (index) => {
    setExpandedFAQ(expandedFAQ === index ? null : index);
  };

  const faqData = [
    {
      question: "Hairstroke có đau không?",
      answer:
        "Không. Kỹ thuật Hairstroke sử dụng công nghệ tiên tiến, tạo cảm giác thoải mái tối đa cho khách hàng trong suốt quá trình thực hiện.",
    },
    {
      question: "Kết quả Hairstroke có tự nhiên không?",
      answer:
        "Có. Hairstroke tạo ra những sợi lông mày như thật, tự nhiên 100% không thể phân biệt được với lông mày thật.",
    },
    {
      question: "Thời gian phục hồi bao lâu?",
      answer:
        "Thời gian phục hồi từ 7-10 ngày. Trong thời gian này, khách hàng cần tuân thủ hướng dẫn chăm sóc để có kết quả tốt nhất.",
    },
    {
      question: "Hairstroke duy trì được bao lâu?",
      answer:
        "Kết quả Hairstroke có thể duy trì từ 12-18 tháng tùy thuộc vào loại da và cách chăm sóc của khách hàng.",
    },
  ];

  return (
    <div className={styles.hairstrokeDetailPage}>
      <Navbar />

      {/* Hero Section */}
      <div className={styles.heroSection}>
        <div className={styles.container}>
          <div className={styles.heroContent}>
            <div className={styles.heroImage}>
              <img src={hairstrokeImg} alt="Hairstroke" />
            </div>
            <div className={styles.heroInfo}>
              <div className={styles.serviceTag}>Dịch vụ</div>
              <h1>Hairstroke</h1>
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
            <h2>Tạo sợi Hairstroke - Công nghệ chăn máy tự nhiên như thật</h2>
            <p>
              <strong>
                Tạo sợi Hairstroke là kỹ thuật tạm đẹp hiện đại nhất hiện nay
              </strong>
              <br />
              Phương pháp này tạo ra những sợi lông mày tinh tế, tự nhiên như
              lông mày thật.
            </p>
            <p>
              <strong>Hairstroke</strong> sử dụng công nghệ tiên tiến để vẽ từng
              sợi lông mày một cách tỉ mỉ, tạo ra hình dáng lông mày hoàn hảo và
              tự nhiên nhất.
            </p>

            <h3>Hairstroke là gì?</h3>
            <p>
              <strong>Hairstroke</strong> là kỹ thuật phun xăm lông mày bằng
              cách vẽ từng sợi lông mày riêng lẻ, mô phỏng hoàn toàn như lông
              mày tự nhiên. Kỹ thuật này tạo ra độ sắc nét và tự nhiên vượt trội
              so với các phương pháp truyền thống.
            </p>

            <div className={styles.highlight}>
              ❤️ Hairstroke mang đến cho bạn đôi lông mày như ý muốn với độ tự
              nhiên 100%
            </div>
          </div>

          {/* Benefits Section */}
          <div className={styles.benefitsSection}>
            <h3>Hairstroke phù hợp với ai?</h3>
            <ul className={styles.benefitsList}>
              <li>
                Người có <strong>lông mày thưa, rụng nhiều</strong> do tuổi tác
                hoặc bệnh lý
              </li>
              <li>
                Người muốn có <strong>lông mày đều, sắc nét</strong> mà không
                cần trang điểm hàng ngày
              </li>
              <li>
                Người bận rộn, không có thời gian chăm chút lông mày mỗi ngày
              </li>
              <li>
                Người muốn có <strong>lông mày tự nhiên</strong> như thật, không
                bị lộ
              </li>
            </ul>
          </div>

          {/* Process Section */}
          <div className={styles.processSection}>
            <h3>Quy trình thực hiện Hairstroke tại LISSE Beauty</h3>
            <div className={styles.processGrid}>
              <div className={styles.processStep}>
                <div className={styles.stepNumber}>1</div>
                <h4>Tư vấn & Thiết kế</h4>
                <p>
                  Chuyên gia tư vấn và thiết kế hình dáng lông mày phù hợp với
                  khuôn mặt
                </p>
              </div>
              <div className={styles.processStep}>
                <div className={styles.stepNumber}>2</div>
                <h4>Chuẩn bị & Vô cảm</h4>
                <p>
                  Làm sạch vùng da và áp dụng gel vô cảm để đảm bảo không đau
                </p>
              </div>
              <div className={styles.processStep}>
                <div className={styles.stepNumber}>3</div>
                <h4>Thực hiện Hairstroke</h4>
                <p>Vẽ từng sợi lông mày một cách tỉ mỉ theo hướng tự nhiên</p>
              </div>
              <div className={styles.processStep}>
                <div className={styles.stepNumber}>4</div>
                <h4>Hoàn thiện & Chăm sóc</h4>
                <p>Kiểm tra kết quả và hướng dẫn cách chăm sóc sau thực hiện</p>
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

          {/* Advantages Section */}
          <div className={styles.advantagesSection}>
            <h3>Ưu điểm của Hairstroke so với các phương pháp khác</h3>
            <div className={styles.comparisonTable}>
              <div className={styles.tableHeader}>
                <div>Tiêu chí</div>
                <div>Hairstroke</div>
                <div>Phun xăm truyền thống</div>
              </div>
              <div className={styles.tableRow}>
                <div>Độ tự nhiên</div>
                <div className={styles.positive}>★★★★★</div>
                <div className={styles.negative}>★★★☆☆</div>
              </div>
              <div className={styles.tableRow}>
                <div>Thời gian duy trì</div>
                <div className={styles.positive}>12-18 tháng</div>
                <div className={styles.negative}>6-12 tháng</div>
              </div>
              <div className={styles.tableRow}>
                <div>Độ đau</div>
                <div className={styles.positive}>Không đau</div>
                <div className={styles.negative}>Hơi đau</div>
              </div>
            </div>
          </div>

          {/* Related Articles */}
          <div className={styles.relatedSection}>
            <h3>Bài viết liên quan</h3>
            <div className={styles.relatedGrid}>
              <div
                className={styles.relatedCard}
                onClick={() => navigate("/beauty-knowledge/glowing-brow")}
              >
                <div className={styles.relatedImage}>
                  <img src={glowingBrowImg} alt="Glowing Brow" />
                </div>
                <div className={styles.relatedContent}>
                  <h4>Glowing Brow</h4>
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

export default HairstrokeDetail;
