"use client";

declare global {
  interface Window {
    undangan: any;
  }
}
import Image from "next/image";
import bg from "@/assets/images/bg.jpg";
import default_img from "@/assets/images/placeholder.webp";
import { useState } from "react";
export default function HomeSection() {
  const [imageSrc, setImageSrc] = useState(bg.src);
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
        className="position-absolute opacity-25 top-50 start-50 translate-middle bg-cover-home"
        style={{ objectFit: "cover" }}
      />

      <div
        className="position-relative text-center bg-overlay-auto"
        style={{ backgroundColor: "unset" }}
      >
        <h1
          className="font-esthetic pt-5 pb-4 fw-medium"
          style={{ fontSize: "2.25rem" }}
        >
          Thiệp mời
        </h1>

        <Image
          src={bg}
          onError={() => setImageSrc(default_img.src)}
          alt="bg"
          width={200}
          height={200}
          onClick={(e) => window.undangan?.guest.modal(e.currentTarget)}
          className="img-center-crop rounded-circle border border-3 border-light shadow my-4 mx-auto cursor-pointer"
        />

        <h2 className="font-esthetic my-4" style={{ fontSize: "2.25rem" }}>
          Tên chú rể &amp; Tên cô dâu
        </h2>

        <p className="my-2" style={{ fontSize: "1.25rem" }}>
          Thứ ngày tháng
        </p>

        <button
          className="btn btn-outline-auto btn-sm shadow rounded-pill px-3 py-1"
          style={{ fontSize: "0.825rem" }}
        >
          <i className="fa-solid fa-calendar-check me-2"></i>
          Save Google Calendar
        </button>

        <div className="d-flex justify-content-center align-items-center mt-4 mb-2">
          <div className="mouse-animation border border-secondary border-2 rounded-5 px-2 py-1 opacity-50">
            <div className="scroll-animation rounded-4 bg-secondary"></div>
          </div>
        </div>

        <p className="pb-4 m-0 text-secondary" style={{ fontSize: "0.825rem" }}>
          Scroll Down
        </p>
      </div>
    </section>
  );
}
