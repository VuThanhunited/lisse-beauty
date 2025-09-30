import React, { useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import RightSidebar from "../../components/RightSidebar/RightSidebar";
import TimelineSection from "../../components/TimelineSection/TimelineSection";
import styles from "./BrandStory.module.css";
import Facility from "../../components/Facility/Facility";
import ExpertSection from "../../components/ExpertSection/ExpertSection";
import { timelineMockData } from "../../data/timelineMockData";
// Import images
import bannerImg from "../../data/banner.jpg";
import ceoImg from "../../data/518342647_122120769032891459_4219618419434067516_n.jpg";
import coreValuesImg from "../../data/518375107_122120771042891459_3218480619733617655_n.jpg";

const BrandStory = () => {
  const [expandedVision, setExpandedVision] = useState(false);
  const [expandedMission, setExpandedMission] = useState(false);
  const [expandedValues, setExpandedValues] = useState({
    sutule: false,
    yeucaidep: false,
    tinhthancautien: false,
    phongcachsong: false,
  });

  const toggleVision = () => {
    if (!expandedVision) {
      setExpandedVision(true);
      setExpandedMission(false); // Thu gọn card kia
    } else {
      setExpandedVision(false);
    }
  };

  const toggleMission = () => {
    if (!expandedMission) {
      setExpandedMission(true);
      setExpandedVision(false); // Thu gọn card kia
    } else {
      setExpandedMission(false);
    }
  };

  const toggleValue = (valueKey) => {
    setExpandedValues((prev) => {
      const newState = Object.keys(prev).reduce((acc, key) => {
        acc[key] = key === valueKey ? !prev[key] : false;
        return acc;
      }, {});
      return newState;
    });
  };


  return (
    <div className={styles.brandStoryPage}>
      <Navbar />
      <RightSidebar />

      {/* Banner Section */}
      <div className={styles.bannerSection}>
        <img
          src={bannerImg}
          alt="Lisse Beauty"
          className={styles.bannerImage}
        />
        <div className={styles.bannerOverlay}>
          <h1>Hành trình Lisse Beauty</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className={styles.mainContent}>
        <div className={styles.container}>
          {/* CEO Introduction Section */}
          <div className={styles.ceoSection}>
            <div className={styles.ceoAvatar}>
              <img src={ceoImg} alt="CEO KIMLY Beauty" />
            </div>
            <div className={styles.ceoInfo}>
              <p>
                Mỗi câu chuyện thương hiệu KIMLY là sự hòa quyện giữa nghệ
                thuật, tâm linh và chính bản thân mình. Mỗi bước đi đều thể hiện
                sự thanh cao, đúng đắn và mang lại giá trị chân thật đến từ trái
                tim.
              </p>
              <p>
                KIMLY không chỉ là một thương hiệu làm đẹp, mà là hành trình lan
                tỏa giá trị chân – thiện – mỹ. Chúng tôi mong muốn mang lại
                những trải nghiệm bằng cả trái tim và tâm huyết để nâng tầm cuộc
                sống.
              </p>
              <div className={styles.signature}>
                <p className={styles.signatureName}>CEO KIMLY Beauty</p>
                <p className={styles.signatureTitle}>Kimly</p>
              </div>
            </div>
          </div>

          {/* Two Column Content */}
          <div className={styles.twoColumnSection}>
            <div className={styles.column}>
              <div
                className={`${styles.card} ${
                  expandedVision ? styles.expanded : ""
                }`}
              >
                {!expandedVision ? (
                  <>
                    <p>
                      KIMLY Beauty hướng đến trở thành thương hiệu hàng đầu
                      trong ngành làm đẹp tại Việt Nam, định nghĩa chuẩn mực của
                      "Nét đẹp tinh tế" và khẳng định vị thế trên bản đồ làm đẹp
                      thế giới.
                    </p>
                    <button className={styles.button} onClick={toggleVision}>
                      <span className={styles.btnIcon} aria-hidden="true">
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M7 10l5 5 5-5"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>
                      Tầm nhìn
                    </button>
                  </>
                ) : (
                  <div className={styles.expandedContent}>
                    <div className={styles.fullContent}>
                      <p>
                        KIMLY Beauty hướng đến trở thành thương hiệu hàng đầu
                        trong ngành làm đẹp tại Việt Nam, tại định nghĩa chuẩn
                        mực của "Nét đẹp tinh tế" và khẳng định vị thế trên bản
                        đồ làm đẹp thế giới.
                      </p>
                      <p>
                        Trong chặng đường phát triển, KIMLY tập trung mở rộng hệ
                        thống chi nhánh tại các thành phố lớn trong nước, đồng
                        thời từng bước vươn ra Đông Nam Á và thị trường quốc tế.
                        Không chỉ cung cấp các giải pháp làm đẹp hiện đại và an
                        toàn, KIMLY còn lan tỏa giá trị của sự tự tin và phong
                        cách sống qua từng dịch vụ, mang lại trải nghiệm toàn
                        diện cho phụ nữ hiện đại.
                      </p>
                    </div>
                    <button
                      className={styles.expandedButton}
                      onClick={toggleVision}
                    >
                      <span className={styles.btnIcon} aria-hidden="true">
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M7 14l5-5 5 5"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>
                      Tầm nhìn
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className={styles.column}>
              <div
                className={`${styles.card} ${
                  expandedMission ? styles.expanded : ""
                }`}
              >
                {!expandedMission ? (
                  <>
                    <p>
                      KIMLY Beauty mang đến những giải pháp làm đẹp hiện đại, an
                      toàn và cá nhân hóa, giúp khách hàng tự tin tỏa sáng từ
                      ngoại hình đến tinh thần. Chúng tôi đồng hành cùng khách
                      hàng ở mọi giai đoạn cuộc đời.
                    </p>
                    <button className={styles.button} onClick={toggleMission}>
                      <span className={styles.btnIcon} aria-hidden="true">
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M7 10l5 5 5-5"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>
                      Sứ mệnh
                    </button>
                  </>
                ) : (
                  <div className={styles.expandedContent}>
                    <div className={styles.fullContent}>
                      <p>
                        KIMLY Beauty mang đến những giải pháp làm đẹp hiện đại,
                        an toàn và cá nhân hóa, giúp khách hàng tự tin tỏa sáng
                        từ ngoại hình đến tinh thần. Chúng tôi đồng hành cùng
                        khách hàng ở mọi giai đoạn cuộc đời.
                      </p>
                      <p>
                        Với đội ngũ chuyên gia giàu kinh nghiệm và công nghệ
                        tiên tiến, KIMLY cam kết mang lại những trải nghiệm làm
                        đẹp đẳng cấp, an toàn và hiệu quả. Chúng tôi không chỉ
                        tạo ra vẻ đẹp bên ngoài mà còn nuôi dưỡng sự tự tin và
                        niềm hạnh phúc từ bên trong, giúp mỗi khách hàng tỏa
                        sáng với phong cách riêng.
                      </p>
                    </div>
                    <button
                      className={styles.expandedButton}
                      onClick={toggleMission}
                    >
                      <span className={styles.btnIcon} aria-hidden="true">
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M7 14l5-5 5 5"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>
                      Sứ mệnh
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Core Values Section */}
          <div className={styles.coreValuesSection}>
            <h2>Giá trị cốt lõi</h2>
            <div className={styles.coreValuesContent}>
              <div className={styles.valuesContainer}>
                <div className={styles.valueItem}>
                  <button
                    className={`${styles.valueButton} ${
                      expandedValues.sutule ? styles.expanded : ""
                    }`}
                    onClick={() => toggleValue("sutule")}
                  >
                    <span className={styles.arrow}>
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                        focusable="false"
                      >
                        <path
                          d="M7 10l5 5 5-5"
                          stroke="#ffffff"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                    <h3>Sự tử tế</h3>
                  </button>
                  <div
                    className={`${styles.valueExpanded} ${
                      expandedValues.sutule ? styles.open : ""
                    }`}
                  >
                    <p>
                      Luôn đối xử với khách hàng, đồng nghiệp và đối tác bằng
                      tinh thần chân thành – trách nhiệm – tôn trọng. Duy trì
                      một môi trường thân thiện, an toàn, thúc đẩy sự phát triển
                      của từng cá nhân.
                    </p>
                  </div>
                </div>

                <div className={styles.valueItem}>
                  <button
                    className={`${styles.valueButton} ${
                      expandedValues.yeucaidep ? styles.expanded : ""
                    }`}
                    onClick={() => toggleValue("yeucaidep")}
                  >
                    <span className={styles.arrow}>
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                        focusable="false"
                      >
                        <path
                          d="M7 10l5 5 5-5"
                          stroke="#ffffff"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                    <h3>Yêu cái đẹp</h3>
                  </button>
                  <div
                    className={`${styles.valueExpanded} ${
                      expandedValues.yeucaidep ? styles.open : ""
                    }`}
                  >
                    <p>
                      Đam mê không ngừng trong việc tạo ra và lan tỏa vẻ đẹp.
                      Chúng tôi tin rằng mỗi người đều có vẻ đẹp riêng và sứ
                      mệnh của chúng tôi là giúp họ khám phá và tôn vinh điều
                      đó.
                    </p>
                  </div>
                </div>

                <div className={styles.valueItem}>
                  <button
                    className={`${styles.valueButton} ${
                      expandedValues.tinhthancautien ? styles.expanded : ""
                    }`}
                    onClick={() => toggleValue("tinhthancautien")}
                  >
                    <span className={styles.arrow}>
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                        focusable="false"
                      >
                        <path
                          d="M7 10l5 5 5-5"
                          stroke="#ffffff"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                    <h3>Tinh thần cầu tiến</h3>
                  </button>
                  <div
                    className={`${styles.valueExpanded} ${
                      expandedValues.tinhthancautien ? styles.open : ""
                    }`}
                  >
                    <p>
                      Không ngừng học hỏi, đổi mới để mang đến những trải nghiệm
                      tốt nhất. Chúng tôi luôn tìm kiếm những xu hướng mới, công
                      nghệ tiên tiến và phương pháp làm đẹp an toàn nhất.
                    </p>
                  </div>
                </div>

                <div className={styles.valueItem}>
                  <button
                    className={`${styles.valueButton} ${
                      expandedValues.phongcachsong ? styles.expanded : ""
                    }`}
                    onClick={() => toggleValue("phongcachsong")}
                  >
                    <span className={styles.arrow}>
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                        focusable="false"
                      >
                        <path
                          d="M7 10l5 5 5-5"
                          stroke="#ffffff"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                    <h3>Phong cách sống</h3>
                  </button>
                  <div
                    className={`${styles.valueExpanded} ${
                      expandedValues.phongcachsong ? styles.open : ""
                    }`}
                  >
                    <p>
                      Làm đẹp không chỉ là dịch vụ, mà là cách sống tích cực và
                      lành mạnh. Chúng tôi khuyến khích khách hàng xây dựng thói
                      quen chăm sóc bản thân một cách bền vững và khoa học.
                    </p>
                  </div>
                </div>

                {/* Mobile image under the Core Values tags (matches mock) */}
                <div className={styles.valuesMobileImage}>
                  <img
                    src={coreValuesImg}
                    alt="Hình ảnh minh họa giá trị cốt lõi"
                  />
                </div>
              </div>

              <div className={styles.valuesImage}>
                <img src={coreValuesImg} alt="Giá trị cốt lõi KIMLY Beauty" />
              </div>
            </div>
          </div>

          {/* Modern Timeline Section */}
          <TimelineSection timelineData={timelineMockData} />
        </div>

        {/* Hero Banner */}
        <div className={styles.heroSection}>
          <div className={styles.heroOverlay}>
            <h1 className={styles.heroTitle}>
              Mỗi khách hàng đều là{" "}
              <span className={styles.scriptText}>đại sứ thương hiệu</span>
            </h1>
          </div>
        </div>
        {/* Expert Team Section */}
        <ExpertSection />
      </div>
      {/* Facilities Section - Cơ sở vật chất */}
      <Facility />
      <Footer />
    </div>
  );
};

export default BrandStory;