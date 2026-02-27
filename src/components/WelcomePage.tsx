"use client";

declare global {
  interface Window {
    undangan: any;
  }
}

import bg from "@/assets/images/bg.jpg";
import default_img from "@/assets/images/placeholder.webp";
import { useState } from "react";


export default function WelcomePage({ setOpened }: { setOpened: (opened: boolean) => void }) {
  const [imageSrc, setImageSrc] = useState(bg.src);
  return (
    <div
      className="loading-page bg-white-black"
      id="welcome"
      style={{ opacity: 1 }}
    >
      <div className="d-flex justify-content-center align-items-center vh-100 overflow-y-auto">
        <div className="d-flex flex-column text-center align-items-center wedding-hero">

          <h2 className="font-secondary wedding-subtitle mb-3"
            style={{ letterSpacing: "2px", fontWeight: 500 }}>
            Đám cưới của
          </h2>

          <img
            src={imageSrc}
            alt="background"
            className="wedding-avatar rounded-circle border border-3 border-light shadow mb-5 mt-5"
            onError={() => setImageSrc(default_img.src)}
          />

          <h2 className="font-primary wedding-names mb-5 ">
            <span className="name-left">Nguyễn Công Danh</span>
            <span className="heart-wrapper">
              <span className="heart-icon">❤</span>
            </span>
            <span className="name-right">Nguyễn Kim Ngân</span>
          </h2>

          <div
            id="guest-name"
            data-message="Kính mời quý vị quan khách"
            className="mb-"
          ></div>

          <button
            type="button"
            className="btn btn-light shadow rounded-4 mt-3 mx-auto"
            onClick={(e) => {
              window.undangan?.guest.open(e.currentTarget);
              setOpened(true);
            }}
          >
            <i className="fa-solid fa-envelope-open fa-bounce me-2"></i>
            Mở thiệp mời
          </button>

        </div>
      </div>
    </div>
  );
}
