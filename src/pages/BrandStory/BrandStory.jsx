import React, { useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import RightSidebar from "../../components/RightSidebar/RightSidebar";
import styles from "./BrandStory.module.css";

// Import images
import bannerImg from "../../data/banner.jpg";
import ceoImg from "../../data/518342647_122120769032891459_4219618419434067516_n.jpg";
import coreValuesImg from "../../data/518375107_122120771042891459_3218480619733617655_n.jpg";
import expertImg1 from "../../data/518600115_122120764574891459_5021028668652265494_n.jpg";
import expertImg2 from "../../data/519421760_122120777714891459_5490134016365387672_n.jpg";
import expertImg3 from "../../data/520240366_122120843918891459_7638784159492956398_n.jpg";
import facilityImg1 from "../../data/520382423_122120854712891459_6189393590492377467_n.jpg";
import facilityImg2 from "../../data/523400147_122123835236891459_4245426327108376588_n.jpg";
import facilityImg3 from "../../data/513989997_122116927598891459_2881096560627137313_n.jpg";

const BrandStory = () => {
  const [expandedVision, setExpandedVision] = useState(true);
  const [expandedMission, setExpandedMission] = useState(false);
  const [expandedValues, setExpandedValues] = useState({
    sutule: true,
    yeucaidep: false,
    tinhthancautien: false,
    phongcachsong: false,
  });
  const [currentExpert, setCurrentExpert] = useState(0);

  const experts = [
    {
      id: 1,
      name: "Trang Nhung",
      image: expertImg1,
      description:
        "Thạc sĩ đoàn viên bản ở đây, khởi tạo và ở về bản để tây chính nơi đáng, phòng cách phòng chú và màu sắc của đoàn văn của bạn.",
    },
    {
      id: 2,
      name: "Mai Linh",
      image: expertImg2,
      description:
        "Chuyên gia về chăm sóc da với hơn 8 năm kinh nghiệm trong ngành làm đẹp và thẩm mỹ.",
    },
    {
      id: 3,
      name: "Thu Hà",
      image: expertImg3,
      description:
        "Bác sĩ thẩm mỹ hàng đầu với nhiều chứng chỉ quốc tế về các phương pháp làm đẹp hiện đại.",
    },
  ];

  const nextExpert = () => {
    setCurrentExpert((prev) => (prev + 1) % experts.length);
  };

  const prevExpert = () => {
    setCurrentExpert((prev) => (prev - 1 + experts.length) % experts.length);
  };

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
          alt="Brand Story Banner"
          className={styles.bannerImage}
        />
        <div className={styles.bannerOverlay}>
          <h1>Câu chuyện thương hiệu</h1>
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
                      <span>▼</span> Tầm nhìn
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
                      <span>▲</span> Tầm nhìn
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
                      <span>▼</span> Sứ mệnh
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
                      <span>▲</span> Sứ mệnh
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
                      {expandedValues.sutule ? "▲" : "▼"}
                    </span>
                    <h3>Sự tử tế</h3>
                  </button>
                  {expandedValues.sutule && (
                    <div className={styles.valueExpanded}>
                      <p>
                        Luôn đối xử với khách hàng, đồng nghiệp và đối tác bằng
                        tinh thần chân thành – trách nhiệm – tôn trọng. Duy trì
                        một môi trường thân thiện, an toàn, thúc đẩy sự phát
                        triển của từng cá nhân.
                      </p>
                    </div>
                  )}
                </div>

                <div className={styles.valueItem}>
                  <button
                    className={`${styles.valueButton} ${
                      expandedValues.yeucaidep ? styles.expanded : ""
                    }`}
                    onClick={() => toggleValue("yeucaidep")}
                  >
                    <span className={styles.arrow}>
                      {expandedValues.yeucaidep ? "▲" : "▼"}
                    </span>
                    <h3>Yêu cái đẹp</h3>
                  </button>
                  {expandedValues.yeucaidep && (
                    <div className={styles.valueExpanded}>
                      <p>
                        Đam mê không ngừng trong việc tạo ra và lan tỏa vẻ đẹp.
                        Chúng tôi tin rằng mỗi người đều có vẻ đẹp riêng và sứ
                        mệnh của chúng tôi là giúp họ khám phá và tôn vinh điều
                        đó.
                      </p>
                    </div>
                  )}
                </div>

                <div className={styles.valueItem}>
                  <button
                    className={`${styles.valueButton} ${
                      expandedValues.tinhthancautien ? styles.expanded : ""
                    }`}
                    onClick={() => toggleValue("tinhthancautien")}
                  >
                    <span className={styles.arrow}>
                      {expandedValues.tinhthancautien ? "▲" : "▼"}
                    </span>
                    <h3>Tinh thần cầu tiến</h3>
                  </button>
                  {expandedValues.tinhthancautien && (
                    <div className={styles.valueExpanded}>
                      <p>
                        Không ngừng học hỏi, đổi mới để mang đến những trải
                        nghiệm tốt nhất. Chúng tôi luôn tìm kiếm những xu hướng
                        mới, công nghệ tiên tiến và phương pháp làm đẹp an toàn
                        nhất.
                      </p>
                    </div>
                  )}
                </div>

                <div className={styles.valueItem}>
                  <button
                    className={`${styles.valueButton} ${
                      expandedValues.phongcachsong ? styles.expanded : ""
                    }`}
                    onClick={() => toggleValue("phongcachsong")}
                  >
                    <span className={styles.arrow}>
                      {expandedValues.phongcachsong ? "▲" : "▼"}
                    </span>
                    <h3>Phong cách sống</h3>
                  </button>
                  {expandedValues.phongcachsong && (
                    <div className={styles.valueExpanded}>
                      <p>
                        Làm đẹp không chỉ là dịch vụ, mà là cách sống tích cực
                        và lành mạnh. Chúng tôi khuyến khích khách hàng xây dựng
                        thói quen chăm sóc bản thân một cách bền vững và khoa
                        học.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className={styles.valuesImage}>
                <img src={coreValuesImg} alt="Giá trị cốt lõi KIMLY Beauty" />
              </div>
            </div>
          </div>

          {/* History Timeline Section */}
          <div className={styles.historySection}>
            <h2>Lịch sử hình thành</h2>

            <div className={styles.timelineContainer}>
              {/* Timeline Item 1 - Left Side */}
              <div className={`${styles.timelineItem} ${styles.left}`}>
                <div className={styles.timelineContent}>
                  <div className={styles.timelineImage}>
                    <img src={coreValuesImg} alt="Năm 2021" />
                  </div>
                  <div className={styles.timelineText}>
                    <div className={styles.timelineTitle}>
                      <h4>Khởi nguồn đam mê</h4>
                    </div>
                    <p>
                      Thành lập KIMLY Beauty tại Hà Nội, bắt đầu từ một studio
                      nhỏ chuyên phun xăm thẩm mỹ với 3 chuyên viên. Đặt nền
                      móng cho triết lý "Nét đẹp tinh tế" – lấy sự tận tâm, kỹ
                      thuật và tinh thần thủ công làm gốc.
                    </p>
                  </div>
                </div>
                <div className={styles.timelineDot}></div>
                <div className={styles.timelineYear}>
                  <h3>Năm 2021</h3>
                </div>
              </div>

              {/* Timeline Item 2 - Right Side */}
              <div className={`${styles.timelineItem} ${styles.right}`}>
                <div className={styles.timelineYear}>
                  <h3>Năm 2022</h3>
                </div>
                <div className={styles.timelineDot}></div>
                <div className={styles.timelineContent}>
                  <div className={styles.timelineImage}>
                    <img src={bannerImg} alt="Năm 2022" />
                  </div>
                  <div className={styles.timelineText}>
                    <div className={styles.timelineTitle}>
                      <h4>Mở rộng thị trường & hệ thống</h4>
                    </div>
                    <p>
                      Khai trương chi nhánh KIMLY tại TP. Hồ Chí Minh, đánh dấu
                      bước tiến mới trong việc mở rộng thị trường miền Nam. Nâng
                      cấp dịch vụ và đầu tư thiết bị hiện đại.
                    </p>
                  </div>
                </div>
              </div>

              {/* Timeline Item 3 - Left Side */}
              <div className={`${styles.timelineItem} ${styles.left}`}>
                <div className={styles.timelineContent}>
                  <div className={styles.timelineImage}>
                    <img src={ceoImg} alt="Năm 2023" />
                  </div>
                  <div className={styles.timelineText}>
                    <div className={styles.timelineTitle}>
                      <h4>Chuẩn hóa vận hành - nâng tầm chất lượng</h4>
                    </div>
                    <p>
                      Xây dựng hệ thống đào tạo nội bộ, chuẩn hóa quy trình kỹ
                      thuật theo tiêu chí: Tận tâm – Tinh tế – Chuyên nghiệp.
                      Tái định vị thương hiệu hướng đến phân khúc cao cấp, đồng
                      bộ trải nghiệm khách hàng trên toàn hệ thống.
                    </p>
                  </div>
                </div>
                <div className={styles.timelineDot}></div>
                <div className={styles.timelineYear}>
                  <h3>Năm 2023</h3>
                </div>
              </div>

              {/* Timeline Item 4 - Right Side */}
              <div className={`${styles.timelineItem} ${styles.right}`}>
                <div className={styles.timelineYear}>
                  <h3>Năm 2024</h3>
                </div>
                <div className={styles.timelineDot}></div>
                <div className={styles.timelineContent}>
                  <div className={styles.timelineImage}>
                    <img src={bannerImg} alt="Năm 2024" />
                  </div>
                  <div className={styles.timelineText}>
                    <div className={styles.timelineTitle}>
                      <h4>Chuyển đổi số & mở rộng hiện diện</h4>
                    </div>
                    <p>
                      Chính thức triển khai website đặt lịch & tư vấn trực
                      tuyến, phát triển nền tảng blog làm đẹp, chatbot. Ra mắt
                      chi nhánh mới tại khu đô thị Vạn Phúc (Hà Đông, Hà Nội) –
                      mở rộng tệp khách hàng trung lưu – cao cấp. Đồng thời nâng
                      cấp nhân diện thương hiệu mới: Hoa Ly & Hồ Ly – thanh cao,
                      thông minh và tràn đầy sức sống.
                    </p>
                  </div>
                </div>
              </div>

              {/* Timeline Item 5 - Left Side */}
              <div className={`${styles.timelineItem} ${styles.left}`}>
                <div className={styles.timelineContent}>
                  <div className={styles.timelineImage}>
                    <img src={coreValuesImg} alt="Năm 2025" />
                  </div>
                  <div className={styles.timelineText}>
                    <div className={styles.timelineTitle}>
                      <h4>Mở rộng hệ thống</h4>
                    </div>
                    <p>
                      Mở thêm 2 chi nhánh mới tại TP. Hồ Chí Minh và Hà Nội,
                      nâng tổng số cơ sở hoạt động lên 5. Từng bước chuẩn bị nền
                      tảng thương hiệu, nhân sự và vận hành.
                    </p>
                  </div>
                </div>
                <div className={styles.timelineDot}></div>
                <div className={styles.timelineYear}>
                  <h3>Năm 2025 - nay</h3>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Brand Ambassador Section */}
        <div className={styles.ambassadorSection}>
          <div className={styles.container}>
            <div className={styles.ambassadorContent}>
              <h2>Mỗi khách hàng đều là đại sứ thương hiệu</h2>
            </div>
          </div>
        </div>

        {/* Expert Team Section */}
        <div className={styles.expertSection}>
          <div className={styles.container}>
            <h2>Đội ngũ chuyên gia</h2>
            <div className={styles.expertCarousel}>
              <button className={styles.carouselBtn} onClick={prevExpert}>
                ‹
              </button>

              <div className={styles.expertCards}>
                {experts.map((expert, index) => (
                  <div
                    key={expert.id}
                    className={`${styles.expertCard} ${
                      index === currentExpert ? styles.active : ""
                    } ${
                      index ===
                      (currentExpert - 1 + experts.length) % experts.length
                        ? styles.prev
                        : ""
                    } ${
                      index === (currentExpert + 1) % experts.length
                        ? styles.next
                        : ""
                    }`}
                  >
                    <div className={styles.expertInfo}>
                      <div className={styles.expertImage}>
                        <img src={expert.image} alt={expert.name} />
                      </div>
                      <div className={styles.expertContent}>
                        <h3>{expert.name}</h3>
                        <p>{expert.description}</p>
                        <button className={styles.expertBtn}>
                          Sản phẩm chuyên gia
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button className={styles.carouselBtn} onClick={nextExpert}>
                ›
              </button>
            </div>

            {/* Carousel indicators */}
            <div className={styles.carouselIndicators}>
              {experts.map((_, index) => (
                <button
                  key={index}
                  className={`${styles.indicator} ${
                    index === currentExpert ? styles.active : ""
                  }`}
                  onClick={() => setCurrentExpert(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Facilities Section - Cơ sở vật chất */}
      <div className={styles.facilitiesSection}>
        <div className={styles.container}>
          <h2>Cơ sở vật chất</h2>
          <p className={styles.facilitiesSubtitle}>
            Không gian sang trọng và hiện đại được thiết kế để mang lại trải
            nghiệm thư giãn tuyệt vời
          </p>

          <div className={styles.facilitiesContainer}>
            {/* Main large image */}
            <div className={styles.mainFacilityImage}>
              <img src={facilityImg1} alt="Phòng điều trị chính Lisse Beauty" />
            </div>

            {/* Small thumbnail images */}
            <div className={styles.facilityThumbnails}>
              <div className={styles.thumbnailItem}>
                <img src={facilityImg2} alt="Khu vực chờ sang trọng" />
              </div>
              <div className={styles.thumbnailItem}>
                <img src={facilityImg3} alt="Phòng tư vấn riêng tư" />
              </div>
              <div className={styles.thumbnailItem}>
                <img src={facilityImg1} alt="Thiết bị hiện đại" />
              </div>
              <div className={styles.thumbnailItem}>
                <img src={facilityImg2} alt="Không gian thư giãn" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default BrandStory;
