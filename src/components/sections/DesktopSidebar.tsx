"use client";
import bg1 from "@/assets/images/1.jpg";
import bg2 from "@/assets/images/2.jpg";
import bg3 from "@/assets/images/3.jpg";
import default_img from "@/assets/images/placeholder.webp";
import { useState } from "react";
import { siteConfig } from "@/config/site";
import Date from "../Date";
export default function DesktopSidebar() {
  const [imageSrc, setImageSrc] = useState(bg1.src);
  const [imageSrc2, setImageSrc2] = useState(bg2.src);
  const [imageSrc3, setImageSrc3] = useState(bg3.src);
  return (
    <div className="sticky-top vh-100 d-none d-sm-block col-sm-5 col-md-6 col-lg-7 col-xl-8 col-xxl-9 overflow-y-hidden m-0 p-0">
      <div className="position-relative bg-white-black d-flex justify-content-center align-items-center vh-100">
        <div className="d-flex position-absolute w-100 h-100">
          <div className="position-relative overflow-hidden vw-100">
            <div
              className="position-absolute h-100 w-100 slide-desktop"
              style={{ opacity: 0 }}
            >
              <img
                src={imageSrc}
                onError={() => setImageSrc(default_img.src)}
                alt="bg"
                className="bg-cover-home"
                style={{ maskImage: "none", opacity: "50%" }}
              />
            </div>
            <div
              className="position-absolute h-100 w-100 slide-desktop"
              style={{ opacity: 0 }}
            >
              <img
                src={imageSrc2}
                onError={() => setImageSrc2(default_img.src)}
                alt="bg"
                className="bg-cover-home"
                style={{ maskImage: "none", opacity: "50%" }}
              />
            </div>
            <div
              className="position-absolute h-100 w-100 slide-desktop"
              style={{ opacity: 0 }}
            >
              <img
                src={imageSrc3}
                onError={() => setImageSrc3(default_img.src)}
                alt="bg"
                className="bg-cover-home"
                style={{ maskImage: "none", opacity: "50%" }}
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

          <Date />
        </div>
      </div>
    </div>
  );
}
