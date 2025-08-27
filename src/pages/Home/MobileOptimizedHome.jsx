import React from "react";
import Navbar from "../../components/Navbar/Navbar";
import MobileOptimizedHeader from "../../components/MobileOptimizedHeader/MobileOptimizedHeader";
import MobileServicesCarousel from "../../components/MobileServicesCarousel/MobileServicesCarousel";
import MobileBookingSection from "../../components/MobileBookingSection/MobileBookingSection";
import FeedbackSlideshow from "../../components/FeedbackSlideshow/FeedbackSlideshow";
import Footer from "../../components/Footer/Footer";
import { mockRootProps } from "../../servicesMockData";
import styles from "./MobileOptimizedHome.module.css";

const MobileOptimizedHome = () => {
  return (
    <div className={styles.homepage}>
      <Navbar />
      <MobileOptimizedHeader />
      <MobileServicesCarousel />
      <MobileBookingSection />
      <FeedbackSlideshow feedbacks={mockRootProps.feedbacks} />
      <Footer />
    </div>
  );
};

export default MobileOptimizedHome;