import React, { useState } from "react";
import styles from "./BookingModal.module.css";
import consultantImage from "../../data/bookingModal.jpg";

const BookingModal = ({ isOpen, onClose }) => {
  console.log("BookingModal render - isOpen:", isOpen);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    service: "",
    consultant: "",
  });

  const services = ["Foxbrows", "Hair stroke", "Sketchlips", "Beauty Care"];

  const consultants = ["Chuyên gia A", "Chuyên gia B", "Chuyên gia C"];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Booking data:", formData);
    alert("Đặt lịch thành công! Chúng tôi sẽ liên hệ với bạn sớm nhất.");
    onClose();
    setFormData({
      name: "",
      phone: "",
      email: "",
      service: "",
      consultant: "",
    });
  };

  if (!isOpen) return null;

  return (
    <div
      className={styles.overlay}
      onClick={onClose}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0, 0, 0, 0.6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 999999,
      }}
    >
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>
          ×
        </button>

        <div className={styles.modalContent}>
          <div className={styles.leftSection}>
            <img
              src={consultantImage}
              alt="Beauty consultation"
              className={styles.consultantImage}
            />
          </div>

          <div className={styles.rightSection}>
            <h2 className={styles.title}>Nhận tư vấn làm đẹp</h2>

            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formGroup}>
                <input
                  type="text"
                  name="name"
                  placeholder="Nhập tên của bạn"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup}>
                <input
                  type="tel"
                  name="phone"
                  placeholder="Số điện thoại"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup}>
                <input
                  type="email"
                  name="email"
                  placeholder="Email của bạn"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup}>
                <select
                  name="service"
                  value={formData.service}
                  onChange={handleInputChange}
                  required
                  className={styles.select}
                >
                  <option value="">Chọn dịch vụ</option>
                  {services.map((service, index) => (
                    <option key={index} value={service}>
                      {service}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <select
                  name="consultant"
                  value={formData.consultant}
                  onChange={handleInputChange}
                  className={styles.select}
                >
                  <option value="">Chọn cơ sở gần bạn</option>
                  {consultants.map((consultant, index) => (
                    <option key={index} value={consultant}>
                      {consultant}
                    </option>
                  ))}
                </select>
              </div>

              <button type="submit" className={styles.submitButton}>
                ĐẶT LỊCH ĐỂ ĐƯỢC TƯ VẤN NGAY →
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
