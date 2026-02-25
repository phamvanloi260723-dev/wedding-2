"use client";

export default function ImageModal() {
  return (
    <div
      className="modal fade"
      id="modal-image"
      tabIndex={-1}
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content rounded-4 border border-0">
          <div className="modal-body p-0">
            <div className="d-flex position-absolute top-0 end-0">
              <a
                className="btn d-flex justify-content-center align-items-center bg-overlay-auto p-2 m-1 rounded-circle border shadow-sm z-1"
                role="button"
                target="_blank"
                href="./assets/images/placeholder.webp"
                id="button-modal-click"
              >
                <i
                  className="fa-solid fa-arrow-up-right-from-square"
                  style={{ width: "1em" }}
                ></i>
              </a>
              <button
                className="btn d-flex justify-content-center align-items-center bg-overlay-auto p-2 m-1 rounded-circle border shadow-sm z-1"
                id="button-modal-download"
              >
                <i
                  className="fa-solid fa-download"
                  style={{ width: "1em" }}
                ></i>
              </button>
              <button
                className="btn d-flex justify-content-center align-items-center bg-overlay-auto p-2 m-1 rounded-circle border shadow-sm z-1"
                data-bs-dismiss="modal"
              >
                <i
                  className="fa-solid fa-circle-xmark"
                  style={{ width: "1em" }}
                ></i>
              </button>
            </div>

            <img
              src="./assets/images/placeholder.webp"
              className="img-fluid w-100 rounded-4 cursor-pointer"
              alt="image"
              id="show-modal-image"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
