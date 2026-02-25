"use client";

export default function LoveGiftSection() {
  return (
    <section className="bg-light-dark pb-3">
      <div className="container text-center">
        <h2 className="font-esthetic pt-3 mb-4" style={{ fontSize: "2.25rem" }}>
          Món quà tình yêu
        </h2>
        <p className="mb-1" style={{ fontSize: "0.95rem" }}>
          Với tất cả sự tôn trọng, những ai muốn gửi tặng chúng tôi một món quà
          thể hiện tình cảm có thể làm điều đó qua:
        </p>

        {/* QR Code - Groom */}
        <div
          className="bg-theme-auto rounded-4 shadow p-3 mx-4 mt-4 text-start"
          data-aos="fade-up"
          data-aos-duration="2500"
        >
          <i className="fa-solid fa-qrcode fa-lg"></i>
          <p className="d-inline">Chuyển Khoản</p>

          <div className="d-flex justify-content-between align-items-center mt-2">
            <p className="m-0 p-0" style={{ fontSize: "0.95rem" }}>
              <i className="fa-regular fa-user fa-sm me-1"></i>Chú rể
            </p>
            <button
              className="btn btn-outline-auto btn-sm shadow-sm rounded-4 py-0"
              style={{ fontSize: "0.75rem" }}
              data-bs-toggle="collapse"
              data-bs-target="#collapseQris1"
            >
              <i className="fa-solid fa-circle-info fa-sm me-1"></i>Info
            </button>
          </div>

          <div className="collapse" id="collapseQris1">
            <hr className="my-2 py-1" />
            <div className="d-flex justify-content-center align-items-center">
              <img
                src="./assets/images/placeholder.webp"
                data-src="./assets/images/donate.png"
                alt="donate"
                className="img-fluid rounded-3 mx-auto bg-white"
              />
            </div>
          </div>
        </div>

        {/* QR Code - Bride */}
        <div
          className="bg-theme-auto rounded-4 shadow p-3 mx-4 mt-4 text-start"
          data-aos="fade-up"
          data-aos-duration="2500"
        >
          <i className="fa-solid fa-qrcode fa-lg"></i>
          <p className="d-inline">Chuyển Khoản</p>

          <div className="d-flex justify-content-between align-items-center mt-2">
            <p className="m-0 p-0" style={{ fontSize: "0.95rem" }}>
              <i className="fa-regular fa-user fa-sm me-1"></i>Cô dâu
            </p>
            <button
              className="btn btn-outline-auto btn-sm shadow-sm rounded-4 py-0"
              style={{ fontSize: "0.75rem" }}
              data-bs-toggle="collapse"
              data-bs-target="#collapseQris2"
            >
              <i className="fa-solid fa-circle-info fa-sm me-1"></i>Info
            </button>
          </div>

          <div className="collapse" id="collapseQris2">
            <hr className="my-2 py-1" />
            <div className="d-flex justify-content-center align-items-center">
              <img
                src="./assets/images/placeholder.webp"
                data-src="./assets/images/donate.png"
                alt="donate"
                className="img-fluid rounded-3 mx-auto bg-white"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
