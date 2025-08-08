import React from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/Home/Home";
import BeautyKnowledge from "./pages/BeautyKnowledge/BeautyKnowledge";
import BrandStory from "./pages/BrandStory/BrandStory";
import Contact from "./pages/Contact/Contact";
import Services from "./pages/Services/Services";
import GlowingBrowDetail from "./pages/GlowingBrowDetail/GlowingBrowDetail";
import HairstrokeDetail from "./pages/HairstrokeDetail/HairstrokeDetail";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/beauty-knowledge" element={<BeautyKnowledge />} />
        <Route
          path="/beauty-knowledge/glowing-brow"
          element={<GlowingBrowDetail />}
        />
        <Route
          path="/beauty-knowledge/hairstroke"
          element={<HairstrokeDetail />}
        />
        <Route path="/brand-story" element={<BrandStory />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/services" element={<Services />} />
      </Routes>
    </div>
  );
}

export default App;
