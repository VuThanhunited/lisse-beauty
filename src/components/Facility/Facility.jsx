import React, { useState, useMemo, useEffect } from "react";
import styles from "./Facility.module.css";
import axios from "axios";

const Facility = () => {
  // Facilities state
    const [selectedFacilityIndex, setSelectedFacilityIndex] = useState(0);
    const [selectedFacilityLocation, setSelectedFacilityLocation] = useState(0);
    const [facilityAutoPlay, setFacilityAutoPlay] = useState(true);
    const [services, setServices] = useState([]);
    // Axios headers
      const headers = useMemo(
        () => ({ Authorization: "TOKEN 2AuVTwbx241MuVxjqnlzUh73SEBPtuzk" }),
        []
      );
    
      // Fetch services
      useEffect(() => {
        const fetchServiceData = async () => {
          try {
            const response = await axios.get(
              "https://api.baserow.io/api/database/rows/table/639961/?user_field_names=true",
              { headers }
            );
            setServices(response.data.results || []);
          } catch (error) {
            console.error("Error fetching service data:", error);
          }
        };
        fetchServiceData();
      }, [headers]);

      // Facilities: derived images for selected location
        const facilityImages = useMemo(() => {
          const svc =
            services[selectedFacilityLocation] &&
            services[selectedFacilityLocation].facilityImg &&
            services[selectedFacilityLocation].facilityImg.length > 0
              ? services[selectedFacilityLocation]
              : services[0];
          return svc && svc.facilityImg ? svc.facilityImg : [];
        }, [services, selectedFacilityLocation]);
      
        // Keep facility index in range
        useEffect(() => {
          if (selectedFacilityIndex >= facilityImages.length) {
            setSelectedFacilityIndex(0);
          }
        }, [facilityImages.length, selectedFacilityIndex]);
      
        // Facilities autoplay
        useEffect(() => {
          if (!facilityAutoPlay || facilityImages.length <= 1) return;
          const id = setInterval(() => {
            setSelectedFacilityIndex((prev) =>
              facilityImages.length > 0 ? (prev + 1) % facilityImages.length : 0
            );
          }, 3000);
          return () => clearInterval(id);
        }, [facilityAutoPlay, facilityImages.length]);
      
    
    return (
      <div className={styles.lisseBeautyFacilitiesSection}>
      <div className={styles.facilitiesHeader}>
        <h2 className={styles.facilitiesHeading}>Cơ sở vật chất tại KIMLY</h2>
        <div className={styles.facilitiesHeadingBar}></div>
        <div className={styles.facilityTabs}>
          {[
            "343 Nguyễn Khang",
            "146 Trưng Phụng",
            "58 Lê Thị Riêng",
            "137 Lê Thị Riêng",
            "Vạn Phúc",
          ].map((label, idx) => (
            <button
              key={idx}
              className={`${styles.facilityTab} ${
                selectedFacilityLocation === idx
                  ? styles.activeFacilityTab
                  : ""
              }`}
              onClick={() => {
                setSelectedFacilityLocation(idx);
                setSelectedFacilityIndex(0);
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      <div
        className={styles.kimlyFacilitiesContainer}
        onMouseEnter={() => setFacilityAutoPlay(false)}
        onMouseLeave={() => setFacilityAutoPlay(true)}
      >
        {(() => {
          const svc =
            services[selectedFacilityLocation] &&
            services[selectedFacilityLocation].facilityImg &&
            services[selectedFacilityLocation].facilityImg.length > 0
              ? services[selectedFacilityLocation]
              : services[0];
          if (!svc || !svc.facilityImg || svc.facilityImg.length === 0)
            return null;
          const images = svc.facilityImg;
          return (
            <>
              <div className={styles.mainFacilityImage}>
                <img
                  key={selectedFacilityIndex}
                  src={
                    images[selectedFacilityIndex]
                      ? images[selectedFacilityIndex].url
                      : images[0].url
                  }
                  alt="Phòng điều trị chính Lisse Beauty"
                  className={styles.mainFacilityPhoto}
                />
              </div>
              {/* Marquee-style infinite thumbnails row */}
              <div className={styles.facilityThumbsMarquee}>
                <div className={styles.facilityThumbsTrack}>
                  {[...images, ...images].map((img, mapIdx) => {
                    const realIdx = mapIdx % images.length;
                    const isActive = realIdx === selectedFacilityIndex;
                    return (
                      <div
                        className={`${styles.facilityThumbItem} ${
                          isActive ? styles.activeThumbnail : ""
                        }`}
                        key={`thumb-${mapIdx}`}
                        onClick={() => setSelectedFacilityIndex(realIdx)}
                        role="button"
                        aria-label={`Xem ảnh cơ sở vật chất ${realIdx + 1}`}
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            setSelectedFacilityIndex(realIdx);
                          }
                        }}
                      >
                        <img
                          src={img.url}
                          alt={`Cơ sở vật chất ${realIdx + 1}`}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          );
        })()}
      </div>
    </div>
    );
};

export default Facility;
