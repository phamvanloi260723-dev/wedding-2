"use client";

import Image from "next/image";
import LoveAnimation from "@/components/LoveAnimation";

declare global {
  interface Window {
    undangan: any;
  }
}
import cewe from "@/assets/images/cewe.webp";
import cowo from "@/assets/images/cowo.webp";
import default_img from "@/assets/images/placeholder.webp";
import { useState } from "react";
export default function BrideSection() {
  const [imageSrc, setImageSrc] = useState(cowo.src);
  const [imageSrc2, setImageSrc2] = useState(cewe.src);

  return (
    <section className="container bg-white-black text-center" id="bride">
      <h2 className="font-arabic py-4 m-0" style={{ fontSize: "2rem" }}>
        Chúng tôi trân trọng kính mời
      </h2>

      <h2 className="font-esthetic py-4 m-0" style={{ fontSize: "2rem" }}>
        Bạn đến dự lễ cưới của chúng tôi
      </h2>

      <p className="pb-4 px-2 m-0" style={{ fontSize: "0.95rem" }}>
        Thật vui khi có bạn ở đây, chúng tôi rất mong được chia sẻ khoảnh khắc
        đặc biệt này với bạn. Hãy cùng chúng tôi tạo nên những kỷ niệm đáng nhớ
        trong ngày trọng đại của chúng tôi!
      </p>

      <div className="overflow-x-hidden pb-4">
        {/* Groom */}
        <div className="position-relative">
          <LoveAnimation top="0%" right="5%" time={500} />

          <div data-aos="fade-right" data-aos-duration="2000" className="pb-1">
            <Image
              src={imageSrc}
              alt="groom"
              width={200}
              height={200}
              onError={() => setImageSrc(default_img.src)}
              onClick={(e) => window.undangan?.guest.modal(e.currentTarget)}
              className="img-center-crop rounded-circle border border-3 border-light shadow my-4 mx-auto cursor-pointer"
            />

            <h2 className="font-esthetic m-0" style={{ fontSize: "2.125rem" }}>
              Tên Chú Rể
            </h2>

            <p className="mt-3 mb-1" style={{ fontSize: "1.25rem" }}>
              Bố
            </p>
            <p className="mb-0">Tên Bố Chú Rể</p>

            <p className="mb-0">Mẹ</p>
            <p className="mb-0">Tên Mẹ Chú Rể</p>
          </div>

          <LoveAnimation top="90%" left="5%" time={2000} />
        </div>

        <h2 className="font-esthetic mt-4" style={{ fontSize: "4.5rem" }}>
          &amp;
        </h2>

        {/* Bride */}
        <div className="position-relative">
          <LoveAnimation top="0%" right="5%" time={3000} />

          <div data-aos="fade-left" data-aos-duration="2000" className="pb-1">
            <Image
              src={imageSrc2}
              alt="bride"
              width={200}
              height={200}
              onError={() => setImageSrc2(default_img.src)}
              onClick={(e) => window.undangan?.guest.modal(e.currentTarget)}
              className="img-center-crop rounded-circle border border-3 border-light shadow my-4 mx-auto cursor-pointer"
            />

            <h2 className="font-esthetic m-0" style={{ fontSize: "2.125rem" }}>
              Tên Cô Dâu
            </h2>

            <p className="mt-3 mb-1" style={{ fontSize: "1.25rem" }}>
              Bố
            </p>
            <p className="mb-0">Tên Bố Cô Dâu</p>

            <p className="mb-0">Mẹ</p>
            <p className="mb-0">Tên Mẹ Cô Dâu</p>
          </div>

          <LoveAnimation top="90%" left="5%" time={2500} />
        </div>
      </div>
    </section>
  );
}