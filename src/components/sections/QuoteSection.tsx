"use client";

export default function QuoteSection() {
  return (
    <section className="bg-light-dark pt-2 pb-4">
      <div className="container text-center">
        <div
          className="bg-theme-auto mt-4 p-3 shadow rounded-4"
          data-aos="fade-down"
          data-aos-duration="2000"
        >
          <p className="p-1 mb-2" style={{ fontSize: "0.95rem" }}>
            Trải qua bao nhiêu chuyện thì chúng tôi đã tìm thấy nhau 1 mảnh ghép
            tình yêu
          </p>
          <p
            className="m-0 p-0 text-theme-auto"
            style={{ fontSize: "0.95rem" }}
          ></p>
        </div>

        <div
          className="bg-theme-auto mt-4 p-3 shadow rounded-4"
          data-aos="fade-down"
          data-aos-duration="2000"
        >
          <p className="p-1 mb-2" style={{ fontSize: "0.95rem" }}>
            Danh sách khách mời đã được gửi đến từng người, nếu bạn chưa nhận
            được, vui lòng liên hệ với chúng tôi để được gửi lại nhé!
          </p>
          <p
            className="m-0 p-0 text-theme-auto"
            style={{ fontSize: "0.95rem" }}
          ></p>
        </div>
      </div>
    </section>
  );
}
