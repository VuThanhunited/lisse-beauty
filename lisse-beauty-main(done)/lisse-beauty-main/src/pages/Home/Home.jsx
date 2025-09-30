import React from "react";
import Navbar from "../../components/Navbar/Navbar";
import Header from "../../components/Header/Header";
import HomeContent from "./HomeContent/HomeContent";
import RightSidebar from "../../components/RightSidebar/RightSidebar";
import "./Home.css";

const HomePage = () => {
  return (
    <div className="homepage">
      <Navbar />
      <div className="desktop-header">
        <Header />
      </div>
      <HomeContent />
      <RightSidebar />
    </div>
  );
};

export default HomePage;
