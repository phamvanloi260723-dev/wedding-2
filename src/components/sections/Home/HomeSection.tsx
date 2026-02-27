"use client";

declare global {
  interface Window {
    undangan: any;
  }
}
import Image from "next/image";
import bg from "@/assets/images/bg.jpg";
import default_img from "@/assets/images/placeholder.webp";

import Date from "@/components/ui/Date";
import { useEffect, useState } from "react";
import { siteConfig } from "@/config/site";
import "./home-section.css";


export default function HomeSection() {
  const [imageSrc, setImageSrc] = useState(bg.src);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreen = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreen();
    window.addEventListener("resize", checkScreen);

    return () => window.removeEventListener("resize", checkScreen);
  }, []);
  function addToGoogleCalendar() {
    const title = `Lễ Cưới ${siteConfig.groomName} & ${siteConfig.brideName}`;
    const details = "Trân trọng kính mời bạn đến tham dự lễ cưới của chúng tôi.";
    const location = "Địa chỉ nhà chúng tôi";

    const weddingDate = new window.Date(siteConfig.weddingDate);
    // Format YYYYMMDDTHHMMSSZ
    const start = weddingDate.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
    const end = new window.Date(weddingDate.getTime() + 3 * 60 * 60 * 1000).toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

    const url =
      "https://calendar.google.com/calendar/render?action=TEMPLATE" +
      "&text=" + encodeURIComponent(title) +
      "&dates=" + start + "/" + end +
      "&details=" + encodeURIComponent(details) +
      "&location=" + encodeURIComponent(location);

    window.open(url, "_blank");
  }
  return (
    <section
      id="home"
      className="bg-light-dark position-relative overflow-hidden p-0 m-0"
    >
      <Image
        src={bg}
        onError={() => setImageSrc(default_img.src)}
        alt="bg"
        fill
        priority

        className="position-absolute opacity-50 top-50 start-50 translate-middle bg-cover-home"
        style={{ objectFit: "cover" }}
      />

      <div
        className="position-relative text-center bg-overlay-auto"
        style={{ backgroundColor: "unset" }}
      >
        <h2
          className="font-secondary pt-5 pb-4"
          style={{ fontSize: "2.25rem" }}
        >
          Thiệp mời
        </h2>

        <Image
          src={bg}
          onError={() => setImageSrc(default_img.src)}
          alt="bg"
          width={200}
          height={200}
          onClick={(e) => window.undangan?.guest.modal(e.currentTarget)}
          className="img-center-crop rounded-circle border border-3 border-light shadow my-4 mx-auto cursor-pointer"
        />
        <h2
          className="font-primary mb-3 mt-4 d-flex flex-column align-items-center text-center"
          style={{
            fontSize: "clamp(1.8rem, 4.5vw, 2.4rem)",
            gap: "18px"
          }}
        >
          <span style={{ maxWidth: "100%", lineHeight: 1.3, fontSize: "1.8rem" }}>
            {siteConfig.groomName}
          </span>

          <span
            style={{
              width: "30px",
              height: "30px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <span
              style={{
                fontSize: "2rem",
                color: "#e8406c",
                position: "relative",
                zIndex: 2,
                animation: "heartBeat 1.8s ease-in-out infinite"
              }}
            >
              ❤
            </span>
          </span>

          <span style={{ maxWidth: "100%", lineHeight: 1.3, fontSize: "1.9rem" }}>
            {siteConfig.brideName}
          </span>
        </h2>

        <div
          className="my-2 mb-4"
          style={{
            fontSize: "1.5rem",
            letterSpacing: "2px"
          }}
        >
          <Date />
        </div>

        <button
          onClick={() => addToGoogleCalendar()}
          className="btn btn-outline-auto btn-sm shadow rounded-pill px-3 py-2 "
          style={{ fontSize: "0.825rem" }}
        >
          <i className="fa-solid fa-calendar-check me-2"></i>
          Save Google Calendar
        </button>

        {isMobile ? (
          /* ================= MOBILE ================= */
          <div className="d-flex justify-content-center align-items-center mt-4 mb-4">

            <div className="pb-4 text-center text-secondary">
              <div className="d-flex flex-column align-items-center gap-2">
                <i
                  className="fa-solid fa-angles-down"
                  style={{
                    fontSize: "1.2rem",
                    animation: "bounceDown 1.6s infinite"
                  }}
                ></i>

                <span style={{ fontSize: "0.825rem" }}>
                  Vuốt lên để xem tiếp
                </span>
              </div>

            </div>
          </div>
        ) : (
          /* ================= DESKTOP ================= */
          <div className="d-flex justify-content-center align-items-center mt-4 mb-2">

            <div className="pb-4 text-center text-secondary">
              <div className="d-flex flex-column align-items-center gap-2">
                <div className="mouse-animation border border-secondary border-2 rounded-5 px-2 py-1 opacity-50">
                  <div className="scroll-animation rounded-4 bg-secondary"></div>
                </div>

                <span style={{ fontSize: "0.825rem" }}>
                  Scroll Down
                </span>
              </div>
            </div>
          </div>


        )}
      </div>
    </section >
  );
}
