"use client";

import StoryTimeline from "@/components/ui/StoryTimeline";
import { petalBurst } from "@/lib/HeartShape";

declare global {
  interface Window {
    undangan: any;
  }
}
import { useState } from "react";

export default function LoveStorySection() {
  const [showStoryOverlay, setShowStoryOverlay] = useState(true);
  const [isFadingStory, setIsFadingStory] = useState(false);
  return (
    <section className="bg-light-dark pt-2 pb-4">
      <div className="container">
        <div className="bg-theme-auto rounded-5 shadow p-3">
          <h2
            className="font-secondary text-center py-2 mb-2"
            style={{ fontSize: "1.9rem" }}
          >
            Câu chuyện tình yêu của chúng tôi
          </h2>

          {/* VIDEO FIXED */}
          <div className="mb-3">
            <video
              src="/video/265501_tiny.mp4"
              autoPlay
              muted
              loop
              controls
              playsInline
              className="w-100 rounded-4 shadow-sm"
            />
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


          {/* STORY */}
          <div className="position-relative">
            {showStoryOverlay && (
              <div
                className={`position-absolute d-flex justify-content-center align-items-center 
                 top-50 start-50 translate-middle w-100 h-100 
                 bg-overlay-auto z-3 transition-opacity duration-300`}
                style={{ opacity: isFadingStory ? 0 : 1, backgroundColor: "unset", transition: "opacity 0.3s ease" }}
              >
                <button
                  className="btn btn-outline-auto btn-sm rounded-4 shadow-sm"
                  onClick={(e) => {
                    const btn = e.currentTarget;
                    petalBurst(btn);
                    setIsFadingStory(true);
                    setTimeout(() => {
                      setShowStoryOverlay(false);
                    }, 300);
                  }}
                >
                  <i className="font-esthetic fa-solid fa-heart fa-bounce me-2"></i>
                  Xem Story
                </button>
              </div>
            )}

            <div
              className="overflow-y-scroll overflow-x-hidden p-2 with-scrollbar"
              style={{ height: "15rem" }}
            >
              <StoryTimeline />
            </div>
          </div>

        </div>
      </div>
    </section >
  );
}