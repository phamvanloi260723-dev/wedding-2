"use client";

import StoryTimeline from "@/components/StoryTimeline";

declare global {
  interface Window {
    undangan: any;
  }
}

export default function LoveStorySection() {
  return (
    <section className="bg-light-dark pt-2 pb-4">
      <div className="container">
        <div className="bg-theme-auto rounded-5 shadow p-3">
          <h2
            className="font-esthetic text-center py-2 mb-2"
            style={{ fontSize: "2.125rem" }}
          >
            Câu chuyện tình yêu của chúng tôi
          </h2>

          {/* Video Love Story */}
          <div
            id="video-love-stroy"
            className="position-relative rounded-4 mb-2 pb-0"
            data-src="./assets/video/265501_tiny.mp4"
            data-vid-class="w-100 rounded-4 shadow-sm m-0 p-0"
          >
            <div
              className="position-absolute d-flex flex-column justify-content-center align-items-center top-50 start-50 translate-middle w-100 h-100 bg-overlay-auto rounded-4 z-3"
              id="video-love-stroy-loading"
            >
              <div
                className="progress w-25"
                role="progressbar"
                style={{ height: "0.5rem" }}
                aria-label="progress bar"
              >
                <div
                  className="progress-bar"
                  id="progress-bar-video-love-stroy"
                  style={{ width: "0%" }}
                ></div>
              </div>
              <small
                className="mt-1 text-theme-auto bg-theme-auto py-0 px-2 rounded-4"
                id="progress-info-video-love-stroy"
                style={{ fontSize: "0.7rem" }}
              ></small>
            </div>
          </div>

          <div className="position-relative">
            <div
              className="position-absolute d-flex justify-content-center align-items-center top-50 start-50 translate-middle w-100 h-100 bg-overlay-auto z-3"
              style={{ opacity: "100%", backgroundColor: "unset" }}
            >
              <button
                className="btn btn-outline-auto btn-sm rounded-4 shadow-sm"
                onClick={(e) =>
                  window.undangan?.guest.showStory(
                    (e.currentTarget as HTMLElement)
                      .parentNode as HTMLDivElement,
                  )
                }
              >
                <i className="fa-solid fa-heart fa-bounce me-2"></i>
                Lihat Story
              </button>
            </div>

            <div
              className="overflow-y-scroll overflow-x-hidden p-2 with-scrollbar"
              style={{ height: "15rem" }}
            >
              <StoryTimeline />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
