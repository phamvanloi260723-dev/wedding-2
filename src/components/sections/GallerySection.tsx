"use client";

import Carousel from "@/components/Carousel";

export default function GallerySection() {
  return (
    <section className="bg-white-black pb-5 pt-3" id="gallery">
      <div className="container">
        <div className="border rounded-5 shadow p-3">
          <h2
            className="font-esthetic text-center py-2 m-0"
            style={{ fontSize: "2.25rem" }}
          >
            Khoảnh khắc của chúng tôi
          </h2>

          <Carousel
            id="carousel-image-one"
            images={[
              { src: "assets/images/18.jpg", alt: "image 1" },
              { src: "assets/images/17.jpg", alt: "image 2" },
              { src: "assets/images/16.jpg", alt: "image 3" },
            ]}
          />

          <Carousel
            id="carousel-image-two"
            images={[
              { src: "assets/images/15.jpg", alt: "image 4" },
              { src: "assets/images/14.jpg", alt: "image 5" },
              { src: "assets/images/13.jpg", alt: "image 6" },
            ]}
          />
        </div>
      </div>
    </section>
  );
}
