"use client";

import { useState, useEffect } from "react";
import { siteConfig } from "@/config/site";

export default function CommentSection() {
  const [name, setName] = useState("");
  const [presence, setPresence] = useState("1");
  const [comment, setComment] = useState("");
  const [commentsList, setCommentsList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch comments
  const fetchComments = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`${siteConfig.apiUrl}v2/comment?per=10&next=0&lang=vi`);
      if (res.ok) {
        const data = await res.json();
        if (data && data.data && data.data.lists) {
          setCommentsList(data.data.lists);
        }
      }
    } catch (err) {
      console.error("Failed to load comments", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !comment.trim()) {
      alert("Vui lòng nhập tên và lời chúc!");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        name,
        presence: presence === "1",
        comment,
      };

      const res = await fetch(`${siteConfig.apiUrl}comment?lang=vi`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setComment("");
        fetchComments(); // Reload danh sách sau khi submit thành công
      }
    } catch (err) {
      console.error("Failed to submit comment", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="bg-light-dark my-0 pb-0 pt-3" id="comment" data-aos="fade-up">
      <div className="container">
        <div className="border rounded-5 shadow p-3 mb-2">
          <h2
            className="font-secondary text-center mt-2 mb-4"
            style={{ fontSize: "2rem" }}
          >
            Lời chúc phúc &amp; Sự hiện diện
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="form-name" className="form-label my-1">
                <i className="fa-solid fa-person me-2"></i>Tên
              </label>
              <input
                dir="auto"
                type="text"
                className="form-control shadow-sm rounded-4"
                id="form-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                minLength={2}
                maxLength={50}
                placeholder="Họ và tên"
                autoComplete="name"
                disabled={isSubmitting}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="form-presence" className="form-label my-1">
                <i className="fa-solid fa-person-circle-question me-2"></i>
                Sự hiện diện
              </label>
              <select
                className="form-select shadow-sm rounded-4"
                id="form-presence"
                value={presence}
                onChange={(e) => setPresence(e.target.value)}
                disabled={isSubmitting}
              >
                <option value="1">&#9989; Tham gia</option>
                <option value="2">&#10060; Không thể đến</option>
              </select>
            </div>

            <div className="d-block mb-3" id="comment-form-default">
              <label htmlFor="form-comment" className="form-label my-1">
                <i className="fa-solid fa-comment me-2"></i>Lời chúc phúc
              </label>
              <div className="position-relative">
                <textarea
                  dir="auto"
                  className="form-control shadow-sm rounded-4"
                  id="form-comment"
                  rows={4}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  minLength={1}
                  maxLength={1000}
                  placeholder="Viết lời chúc phúc của bạn tại đây..."
                  disabled={isSubmitting}
                  required
                ></textarea>
              </div>
            </div>

            <div className="d-grid">
              <button
                type="submit"
                className="btn btn-primary btn-sm rounded-4 shadow m-1"
                disabled={isSubmitting}
              >
                <i className="fa-solid fa-paper-plane me-2"></i>
                {isSubmitting ? "Đang gửi..." : "Gửi lời chúc phúc"}
              </button>
            </div>
          </form>
        </div>

        {/* Comments List */}
        <div className="py-3" id="comments">
          {isLoading ? (
            <div className="text-center p-4">Đang tải lời chúc...</div>
          ) : commentsList.length === 0 ? (
            <div className="text-center p-4 mx-0 mt-0 mb-3 bg-theme-auto rounded-4 shadow">
              <p className="fw-bold p-0 m-0" style={{ fontSize: "0.95rem" }}>
                Hãy là người đầu tiên gửi lời chúc! 🎉
              </p>
            </div>
          ) : (
            commentsList.map((c) => (
              <div key={c.uuid} className="p-3 mb-3 bg-theme-auto rounded-4 shadow-sm border">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <strong className="d-flex align-items-center gap-2">
                    {c.name}
                    {c.presence ? (
                      <span className="badge bg-success rounded-pill" style={{ fontSize: "0.6rem" }}>Tham gia</span>
                    ) : (
                      <span className="badge bg-danger rounded-pill" style={{ fontSize: "0.6rem" }}>Không tham gia</span>
                    )}
                  </strong>
                  <small className="opacity-50" style={{ fontSize: "0.75rem" }}>
                    {new Date(c.created_at).toLocaleDateString("vi-VN")}
                  </small>
                </div>
                <p className="m-0 text-break" style={{ fontSize: "0.95rem" }}>
                  {c.comment}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
