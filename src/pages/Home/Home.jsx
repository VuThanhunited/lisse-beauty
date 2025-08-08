import React from "react";
import Navbar from "../../components/Navbar/Navbar";
import Header from "../../components/Header/Header";
import HomeContent from "./HomeContent/HomeContent";
import RightSidebar from "../../components/RightSidebar/RightSidebar";

const HomePage = () => {
  return (
    <div className="homepage">
      <Navbar />
      <Header />
      <HomeContent />
      <RightSidebar />
    </div>
  );
};

export default HomePage;
