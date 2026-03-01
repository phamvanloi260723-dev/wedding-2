"use client";

import Image from "next/image";
import LoveAnimation from "@/components/ui/LoveAnimation";

declare global {
  interface Window {
    undangan: any;
  }
}
import cewe from "@/assets/images/cewe.webp";
import cowo from "@/assets/images/cowo.webp";
import default_img from "@/assets/images/placeholder.webp";
import { useState } from "react";
import { siteConfig } from "@/config/site";
export default function BrideSection() {
  const [imageSrc, setImageSrc] = useState(cowo.src);
  const [imageSrc2, setImageSrc2] = useState(cewe.src);

  return (
    <section className="container bg-white-black text-center" id="bride">
      <h2
        className="font-secondary py-3 m-0 d-flex flex-column align-items-center text-center"
        style={{
          fontSize: "1.7rem",
          lineHeight: 1.5
        }}
      >
        <span>Chúng tôi trân trọng kính mời.</span>
        <span>Bạn đến dự lễ cưới của chúng tôi</span>
      </h2>
      <p className="font-esthetic pb-4 px-2 m-0">
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

            <h2 className="font-secondary m-0" style={{ fontSize: "2.125rem" }}>
              {siteConfig.groomName}
            </h2>

            <p className="font-esthetic mt-3 mb-1" >
              Bố
            </p>
            <p className="font-esthetic mb-0">{siteConfig.groomFatherName}</p>
            <p className="font-esthetic mb-0">Mẹ</p>
            <p className="font-esthetic mb-0">{siteConfig.groomMotherName}</p>
          </div>

          <LoveAnimation top="90%" left="5%" time={2000} />
        </div>

        <h2 className="font-primary mt-4" style={{ fontSize: "4.5rem" }}>
          &amp;
        </h2>

        {/* Bride */}
        <div className="position-relative">
          <LoveAnimation top="0%" right="5%" time={2000} />

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

            <h2 className="font-secondary m-0" style={{ fontSize: "2.125rem" }}>
              {siteConfig.brideName}
            </h2>

            <p className="font-esthetic mt-3 mb-1" >
              Bố
            </p>
            <p className="font-esthetic mb-0">{siteConfig.brideFatherName}</p>
            <p className="font-esthetic mb-0">Mẹ</p>
            <p className="font-esthetic mb-0">{siteConfig.brideMotherName}</p>
          </div>

          <LoveAnimation top="90%" left="5%" time={2500} />
        </div>
      </div>
    </section>
  );
}