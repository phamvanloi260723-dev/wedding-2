"use client";

declare global {
  interface Window {
    undangan: any;
  }
}
import default_img from "@/assets/images/placeholder.webp";
export default function Carousel({
  id,
  images,
}: {
  id: string;
  images: { src: string; alt: string }[];
}) {
  return (
    <div
      id={id}
      data-aos="fade-up"
      data-aos-duration="1500"
      className="carousel slide mt-4"
      data-bs-ride="carousel"
      data-bs-interval="3000"
    >
      <div className="carousel-indicators">
        {images.map((_, i) => (
          <button
            key={i}
            type="button"
            data-bs-target={`#${id}`}
            data-bs-slide-to={String(i)}
            className={i === 0 ? "active" : ""}
            aria-current={i === 0 ? "true" : undefined}
            aria-label={`Slide ${i + 1}`}
          ></button>
        ))}
      </div>

      <div className="carousel-inner rounded-4">
        {images.map((img, i) => (
          <div key={i} className={`carousel-item${i === 0 ? " active" : ""}`}>
            <img
              src={img.src}
              alt={img.alt}
              className="d-block w-100 img-fluid cursor-pointer"
              onError={(e) => {
                e.currentTarget.onerror = null; // tránh loop vô hạn
                e.currentTarget.src = default_img.src;
              }}
              onClick={(e) => window.undangan?.guest?.modal?.(e.currentTarget)}
            />
          </div>
        ))}
      </div>

      <button
        className="carousel-control-prev"
        type="button"
        data-bs-target={`#${id}`}
        data-bs-slide="prev"
      >
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Previous</span>
      </button>

      <button
        className="carousel-control-next"
        type="button"
        data-bs-target={`#${id}`}
        data-bs-slide="next"
      >
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Next</span>
      </button>
    </div>
  );
}
