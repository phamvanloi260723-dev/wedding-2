"use client";

declare global {
  interface Window {
    undangan: any;
  }
}

export default function CommentSection() {
  return (
    <section className="bg-light-dark my-0 pb-0 pt-3" id="comment">
      <div className="container">
        <div className="border rounded-5 shadow p-3 mb-2">
          <h2
            className="font-esthetic text-center mt-2 mb-4"
            style={{ fontSize: "2.25rem" }}
          >
            Lời chúc phúc &amp; Sự hiện diện
          </h2>

          <div className="mb-3">
            <label htmlFor="form-name" className="form-label my-1">
              <i className="fa-solid fa-person me-2"></i>Tên
            </label>
            <input
              dir="auto"
              type="text"
              className="form-control shadow-sm rounded-4"
              id="form-name"
              minLength={2}
              maxLength={50}
              placeholder="Họ và tên"
              autoComplete="name"
              data-offline-disabled="false"
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
              autoComplete="off"
              aria-placeholder="Chọn"
              data-offline-disabled="false"
            >
              <option value="1">&#9989; Tham gia</option>
              <option value="2">&#10060; Không thể đến</option>
            </select>
          </div>

          <div className="d-block mb-3" id="comment-form-default">
            <div
              id="information"
              className="alert alert-info alert-dismissible fade show rounded-4"
              role="alert"
            >
              <button
                type="button"
                className="btn-close rounded-4 p-3"
                data-bs-dismiss="alert"
                aria-label="Close"
                onClick={() => window.undangan?.guest.closeInformation()}
              ></button>

              <p style={{ fontSize: "1.5rem" }}>Bestieee!!!</p>
              <p className="m-0">
                Cobain like seperti Instagram, dengan tap tap bagian komentarnya
              </p>
              <hr className="my-2" />
              <p className="m-0">
                Sama bisa format text seperti Whatsapp lohh... cobainn jugaaa,
                makaciwww bestieee
              </p>
            </div>

            <label htmlFor="form-comment" className="form-label my-1">
              <i className="fa-solid fa-comment me-2"></i>Lời chúc phúc
            </label>
            <div className="position-relative">
              <button
                className="btn btn-secondary btn-sm rounded-4 shadow-sm me-1 my-1 position-absolute bottom-0 end-0"
                onClick={() =>
                  window.undangan?.comment.gif.open(
                    window.undangan?.comment.gif.default,
                  )
                }
                aria-label="button gif"
                data-offline-disabled="false"
              >
                <i className="fa-solid fa-photo-film"></i>
              </button>
              <textarea
                dir="auto"
                className="form-control shadow-sm rounded-4"
                id="form-comment"
                rows={4}
                minLength={1}
                maxLength={1000}
                placeholder="Viết lời chúc phúc của bạn tại đây..."
                autoComplete="off"
                data-offline-disabled="false"
              ></textarea>
            </div>
          </div>

          <div className="d-none mb-3" id="gif-form-default"></div>

          <div className="d-grid">
            <button
              className="btn btn-primary btn-sm rounded-4 shadow m-1"
              onClick={(e) => window.undangan?.comment.send(e.currentTarget)}
              data-offline-disabled="false"
            >
              <i className="fa-solid fa-paper-plane me-2"></i>Gửi lời chúc phúc
            </button>
          </div>
        </div>

        {/* Comments */}
        <div className="py-3" id="comments" data-loading="false"></div>

        {/* Pagination */}
        <nav
          className="d-flex d-none justify-content-center mt-1 mb-0"
          id="pagination"
        ></nav>
      </div>
    </section>
  );
}
