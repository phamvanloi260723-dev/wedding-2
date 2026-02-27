"use client";
import donate from "@/assets/images/donate.png";
import default_img from "@/assets/images/placeholder.webp";
import { siteConfig } from "@/config/site";
import Image from "next/image";
export default function LoveGiftSection() {
  return (

    <section className="bg-light-dark pb-3">
      <div className="container text-center">
        <h2 className="font-secondary pt-3 mb-3" style={{ fontSize: "2.25rem" }} data-aos="fade-up">
          Món quà tình yêu
        </h2>
        <p className="container font-esthetic mb-1" style={{ fontSize: "0.9rem" }} data-aos="fade-up">
          Với tất cả sự tôn trọng, những ai muốn gửi tặng chúng tôi một món quà
          thể hiện tình cảm có thể làm điều đó qua.
        </p>

        {/* QR Code - Groom */}
        <div>
          {siteConfig.donationAccounts.map((acc, index) => (
            <div
              key={acc.id}
              className="bg-theme-auto rounded-4 shadow p-3 mx-4 mt-4 text-start"
              data-aos="fade-up"
            >
              <i className="fa-solid fa-qrcode fa-lg me-2"></i>
              <p className="d-inline">Chuyển Khoản</p>

              <div className="d-flex justify-content-between align-items-center mt-2">
                <p className="m-0 p-0" style={{ fontSize: "0.95rem" }}>
                  <i className="fa-regular fa-user fa-sm me-2"></i>
                  {acc.label}
                </p>

                <button
                  className="btn btn-outline-auto btn-sm shadow-sm rounded-4 py-0"
                  style={{ fontSize: "0.75rem" }}
                  data-bs-toggle="collapse"
                  data-bs-target={`#collapseQris${index}`}
                >
                  <i className="fa-solid fa-circle-info fa-sm me-1"></i>
                  Info
                </button>
              </div>

              <div className="collapse" id={`collapseQris${index}`}>
                <hr className="my-2 py-1" />

                <div
                  className="mb-2 text-center"
                  style={{ fontSize: "0.9rem" }}
                >
                  <i className="fa-solid fa-phone me-2"></i>
                  {acc.phone}
                </div>

                <div className="d-flex justify-content-center align-items-center">
                  <Image
                    src={acc.qrImage}
                    alt={acc.label}
                    width={250}
                    height={250}
                    className="rounded-3 bg-white"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = default_img.src;
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}