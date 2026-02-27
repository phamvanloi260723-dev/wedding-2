"use client";

export default function QuoteSection() {
  return (
    <section className="bg-light-dark pt-2 pb-4">
      <div className=" container  text-center">

        <QuoteCard>
          Trải qua bao nhiêu chuyện thì chúng tôi đã tìm thấy nhau –
          một mảnh ghép hoàn hảo của tình yêu.
        </QuoteCard>

        <QuoteCard>
          Danh sách khách mời đã được gửi đến từng người.
          Nếu bạn chưa nhận được, vui lòng liên hệ với chúng tôi
          để được gửi lại nhé!
        </QuoteCard>

      </div>
    </section>
  );
}

function QuoteCard({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="font-esthetic bg-theme-auto mt-4 p-3 shadow rounded-4"
      data-aos="fade-down"
      data-aos-duration="2000"
    >
      <p className="mb-0" style={{ fontSize: "0.95rem" }}>
        {children}
      </p>
    </div>
  );
}