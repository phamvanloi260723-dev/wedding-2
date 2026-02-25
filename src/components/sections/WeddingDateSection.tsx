"use client";

import LoveAnimation from "@/components/LoveAnimation";

export default function WeddingDateSection() {
  return (
    <section className="bg-white-black pb-2" id="wedding-date">
      <div className="container text-center">
        <h2 className="font-esthetic py-4 m-0" style={{ fontSize: "2.25rem" }}>
          Đếm ngược đến ngày trọng đại
        </h2>
        <h2 className="py-2">Ngày cưới 22/01/2026</h2>

        <div className="border rounded-pill shadow py-2 px-4 mt-2 mb-4">
          <div className="row justify-content-center">
            <div className="col-3 p-1">
              <p
                className="d-inline m-0 p-0"
                style={{ fontSize: "1.25rem" }}
                id="day"
              >
                0
              </p>
              <small className="ms-1 me-0 my-0 p-0 d-inline">Ngày</small>
            </div>
            <div className="col-3 p-1">
              <p
                className="d-inline m-0 p-0"
                style={{ fontSize: "1.25rem" }}
                id="hour"
              >
                0
              </p>
              <small className="ms-1 me-0 my-0 p-0 d-inline">Giờ</small>
            </div>
            <div className="col-3 p-1">
              <p
                className="d-inline m-0 p-0"
                style={{ fontSize: "1.25rem" }}
                id="minute"
              >
                0
              </p>
              <small className="ms-1 me-0 my-0 p-0 d-inline">Phút</small>
            </div>
            <div className="col-3 p-1">
              <p
                className="d-inline m-0 p-0"
                style={{ fontSize: "1.25rem" }}
                id="second"
              >
                0
              </p>
              <small className="ms-1 me-0 my-0 p-0 d-inline">Giây</small>
            </div>
          </div>
        </div>

        <p className="py-2 m-0" style={{ fontSize: "0.95rem" }}>
          Chúng tôi rất mong được gặp bạn vào ngày trọng đại của chúng tôi!
        </p>

        <LoveAnimation top="0%" right="5%" time={3000} wrapper />

        <div className="overflow-x-hidden">
          <div className="py-2" data-aos="fade-right" data-aos-duration="1500">
            <h2 className="font-esthetic m-0 py-2" style={{ fontSize: "2rem" }}>
              Lễ Thành Hôn
            </h2>
            <p style={{ fontSize: "0.95rem" }}>
              Ghi Thời gian bắt đầu - thời gian kết thúc
            </p>
          </div>

          <div className="py-2" data-aos="fade-left" data-aos-duration="1500">
            <h2 className="font-esthetic m-0 py-2" style={{ fontSize: "2rem" }}>
              Tiệc Cưới
            </h2>
            <p style={{ fontSize: "0.95rem" }}>
              ghi thời gian bắt đầu - thời gian kết thúc
            </p>
          </div>
        </div>

        <p className="py-2 m-0" style={{ fontSize: "0.95rem" }}>
          Để thể hiện sự thân thiện lẫn nhau, chúng tôi đề nghị quý vị tuân thủ
          quy định về trang phục sau đây:
        </p>

        <LoveAnimation top="0%" left="5%" time={2000} wrapper />

        <div className="py-2" data-aos="fade-down" data-aos-duration="1500">
          <div className="d-flex justify-content-center align-items-center mb-3">
            <div
              className="shadow rounded-circle border border-secondary"
              style={{
                width: "3rem",
                height: "3rem",
                backgroundColor: "white",
              }}
            ></div>
            <div
              className="shadow rounded-circle border border-secondary"
              style={{
                width: "3rem",
                height: "3rem",
                backgroundColor: "rgb(0, 0, 0)",
                marginLeft: "-1rem",
              }}
            ></div>
          </div>
        </div>

        <div className="py-2" data-aos="fade-down" data-aos-duration="1500">
          <small className="d-block my-1">Địa chỉ nhà chú rể</small>
          <a
            href="https://maps.app.goo.gl/E6CRjFDxxV4v57GJ9"
            target="_blank"
            className="btn btn-outline-auto btn-sm rounded-pill shadow mb-2 px-3"
          >
            <i className="fa-solid fa-map-location-dot me-2"></i>Google Maps
          </a>
          <small className="d-block my-1">Địa chỉ nhà cô dâu</small>
          <a
            href="https://maps.app.goo.gl/7jt5qC8JPukcc8NV8"
            target="_blank"
            className="btn btn-outline-auto btn-sm rounded-pill shadow mb-2 px-3"
          >
            <i className="fa-solid fa-map-location-dot me-2"></i>Google Maps
          </a>
        </div>
      </div>
    </section>
  );
}
