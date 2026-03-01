"use client";

import Carousel from "@/components/ui/Carousel";

import image1 from "@/assets/images/18.jpg";
import image2 from "@/assets/images/17.jpg";
import image3 from "@/assets/images/16.jpg";
import image4 from "@/assets/images/15.jpg";
import image5 from "@/assets/images/14.jpg";
import image6 from "@/assets/images/13.jpg";

export default function GallerySection() {
  return (
    <section className="bg-white-black pb-5 pt-3" id="gallery">
      <div className="container">
        <div className="border rounded-5 shadow p-3">
          <h2
            className="font-secondary text-center py-2 m-0"
            style={{ fontSize: "2.25rem" }}
          >
            Khoảnh khắc của chúng tôi
          </h2>

          <Carousel
            id="carousel-image-one"
            images={[
              { src: image1.src, alt: "Image 1" },
              { src: image2.src, alt: "Image 2" },
              { src: image3.src, alt: "Image 3" },
            ]}

          />

          <Carousel
            id="carousel-image-two"
            images={[
              { src: image4.src, alt: "Image 4" },
              { src: image5.src, alt: "Image 5" },
              { src: image6.src, alt: "Image 6" },
            ]}
          />
        </div>
      </div>
    </section>
  );
}