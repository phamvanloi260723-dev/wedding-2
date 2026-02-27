"use client";

const stories = [
  {
    num: 1,
    title: "💼 Một khởi đầu",
    text: "Wahyu và Riski gặp nhau lần đầu tại một hội thảo khởi nghiệp vào tháng 1 năm 2025. Wahyu, một nhà thiết kế đồ họa tự do, đang tìm kiếm cơ hội hợp tác để mở rộng mạng lưới, trong khi Riski, một chuyên gia marketing kỹ thuật số, đang trình bày về tầm quan trọng của thương hiệu cá nhân. Cuộc trò chuyện giữa họ bắt đầu một cách tự nhiên sau bài thuyết trình của Riski, khi Wahyu bày tỏ sự ngưỡng mộ đối với chiến lược tiếp thị sáng tạo của cô. Họ nhanh chóng nhận ra rằng cả hai có nhiều điểm chung về sở thích và giá trị sống, đặc biệt là niềm tin vào sức mạnh của sự kiên trì và lòng tốt.",
  },
  {
    num: 2,
    title: "💞 Gieo mầm tình yêu trong thử thách",
    text: "Qua những lần gặp gỡ sau đó, tình cảm giữa Wahyu và Riski ngày càng sâu đậm. Họ cùng nhau trải qua những thử thách của cuộc sống, từ áp lực công việc đến những khó khăn cá nhân. Wahyu luôn là người lắng nghe và hỗ trợ Riski mỗi khi cô gặp khó khăn trong công việc, trong khi Riski luôn khích lệ Wahyu theo đuổi đam mê thiết kế của mình. Một kỷ niệm đáng nhớ là khi Wahyu bị mất một dự án lớn, Riski đã ở bên cạnh anh, giúp anh nhìn nhận lại tình hình và tìm ra giải pháp mới. Sự kiên cường và lòng tốt của họ đã giúp mối quan hệ của họ trở nên vững chắc hơn bao giờ hết.",
  },
  {
    num: 3,
    title: "💍 Từng bước tiến tới hôn nhân",
    text: "Sau hai năm hẹn hò, Wahyu quyết định cầu hôn Riski trong một chuyến du lịch đến Bali, nơi họ đã có nhiều kỷ niệm đẹp bên nhau. Wahyu đã chuẩn bị một buổi tối đặc biệt với những món ăn yêu thích của Riski và một chiếc nhẫn được thiết kế riêng cho cô. Khi anh quỳ xuống cầu hôn, Riski đã rất xúc động và đồng ý ngay lập tức. Họ đã lên kế hoạch cho một đám cưới nhỏ gọn với sự tham gia của gia đình và bạn bè thân thiết, nơi họ sẽ chính thức bắt đầu chương mới của cuộc đời mình cùng nhau.",
  },
];

export default function StoryTimeline() {
  return (
    <>
      {stories.map((s) => (
        <div className="row" key={s.num}>
          <div className="col-auto position-relative">
            <p
              className="position-relative d-flex justify-content-center align-items-center bg-theme-auto border border-secondary border-2 opacity-100 rounded-circle m-0 p-0 z-1"
              style={{ width: "2rem", height: "2rem" }}
            >
              {s.num}
            </p>
            <hr className="position-absolute top-0 start-50 translate-middle-x border border-secondary h-100 z-0 opacity-100 m-0 rounded-4 shadow-none" />
          </div>
          <div className="col mt-1 mb-3 ps-0">
            <p className="fw-bold mb-2">{s.title}</p>
            <p className="small mb-0">{s.text}</p>
          </div>
        </div>
      ))}
    </>
  );
}
