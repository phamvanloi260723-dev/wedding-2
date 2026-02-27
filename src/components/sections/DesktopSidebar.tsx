"use client";
import bg1 from "@/assets/images/1.jpg";
import bg2 from "@/assets/images/2.jpg";
import bg3 from "@/assets/images/3.jpg";
import default_img from "@/assets/images/placeholder.webp";
import { useState, useEffect } from "react";
import { siteConfig } from "@/config/site";
import Date from "@/components/ui/Date";

export default function DesktopSidebar() {
  const [imageSrc, setImageSrc] = useState(bg1.src);
  const [imageSrc2, setImageSrc2] = useState(bg2.src);
  const [imageSrc3, setImageSrc3] = useState(bg3.src);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % 3);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="sticky-top vh-100 d-none d-sm-block col-sm-5 col-md-6 col-lg-7 col-xl-8 col-xxl-9 overflow-y-hidden m-0 p-0">
      <div className="position-relative bg-white-black d-flex justify-content-center align-items-center vh-100">
        <div className="d-flex position-absolute w-100 h-100">
          <div className="position-relative overflow-hidden vw-100">
            <div
              className={`position-absolute h-100 w-100 slide-desktop ${activeIndex === 0 ? "slide-desktop-active" : ""}`}
              style={{ opacity: activeIndex === 0 ? 1 : 0, transition: "opacity 1.5s ease-in-out, transform 10s linear" }}
            >
              <img
                src={imageSrc}
                onError={() => setImageSrc(default_img.src)}
                alt="bg"
                className="bg-cover-home"
                style={{ maskImage: "none", opacity: "65%" }}
              />
            </div>
            <div
              className={`position-absolute h-100 w-100 slide-desktop ${activeIndex === 1 ? "slide-desktop-active" : ""}`}
              style={{ opacity: activeIndex === 1 ? 1 : 0, transition: "opacity 1.5s ease-in-out, transform 10s linear" }}
            >
              <img
                src={imageSrc2}
                onError={() => setImageSrc2(default_img.src)}
                alt="bg"
                className="bg-cover-home"
                style={{ maskImage: "none", opacity: "65%" }}
              />
            </div>
            <div
              className={`position-absolute h-100 w-100 slide-desktop ${activeIndex === 2 ? "slide-desktop-active" : ""}`}
              style={{ opacity: activeIndex === 2 ? 1 : 0, transition: "opacity 1.5s ease-in-out, transform 10s linear" }}
            >
              <img
                src={imageSrc3}
                onError={() => setImageSrc3(default_img.src)}
                alt="bg"
                className="bg-cover-home"
                style={{ maskImage: "none", opacity: "65%" }}
              />
            </div>
          </div>
        </div>

        <div className="text-center p-4 bg-overlay-auto rounded-5">
          <h2 className="font-primary wedding-names mb-3">
            <span className="name-left" style={{ fontSize: "1.4rem" }}>{siteConfig.groomName}</span>
            <span className="heart-icon">❤</span>
            <span className="name-right" style={{ fontSize: "1.4rem" }}>{siteConfig.brideName}</span>
          </h2>

          <div className="text-theme-auto" style={{ fontSize: "1.15rem", letterSpacing: "2px", opacity: 0.9 }}>
            <Date />
          </div>
        </div>
      </div>
    </div>
  );
}
