"use client";

declare global {
  interface Window {
    undangan: any;
  }
}

import bg from "@/assets/images/bg.jpg";
import default_img from "@/assets/images/placeholder.webp";
import { useState } from "react";
import { siteConfig } from "@/config/site";
import { openAnimation } from "@/lib/HeartShape";
import { launchFirework } from "@/lib/FireworkEffect";

interface Props {
  setOpened: (opened: boolean) => void;
  onOpen: (el: HTMLElement) => void;
}

export default function WelcomePage({ setOpened, onOpen }: Props) {
  const [imageSrc, setImageSrc] = useState(bg.src);
  const [isFading, setIsFading] = useState(false);
  const [isClosed, setIsClosed] = useState(false);

  if (isClosed) return null;

  return (
    <div
      className="loading-page bg-white-black"
      id="welcome"
      style={{ opacity: isFading ? 0 : 1, transition: 'opacity 0.8s ease', pointerEvents: isFading ? 'none' : 'auto' }}
    >
      <div className="d-flex justify-content-center align-items-center vh-100 overflow-y-auto">
        <div className="d-flex flex-column text-center align-items-center wedding-hero">

          <h2 className="font-secondary wedding-subtitle mb-3"
            style={{ letterSpacing: "2px", fontWeight: 500 }}>
            Đám cưới của
          </h2>

          <img
            src={imageSrc}
            alt="background"
            className="wedding-avatar rounded-circle border border-3 border-light shadow mb-5 mt-5"
            onError={() => setImageSrc(default_img.src)}
          />

          <h2 className="font-primary wedding-names mb-5 ">
            <span className="name-left">{siteConfig.groomName}</span>
            <span className="heart-icon">❤</span>
            <span className="name-right">{siteConfig.brideName}</span>
          </h2>

          <div
            id="guest-name"
            data-message="Kính mời quý vị quan khách"
            className="mb-"
          ></div>


          <button
            type="button"
            className="btn btn-light shadow rounded-4 mt-3 mx-auto"
            onClick={(e) => {
              const el = e.currentTarget;
              el.disabled = true;

              // Immediately open the card and start fading
              window.scrollTo({ top: 0, behavior: "instant" });
              setOpened(true);
              setIsFading(true);

              // Capture the button's position before it disappears
              const rect = el.getBoundingClientRect();
              const originX = (rect.left + rect.width / 2) / window.innerWidth;
              const originY = (rect.top + rect.height / 2) / window.innerHeight;

              // Let the card fade out completely, THEN fire the fireworks
              setTimeout(async () => {
                setIsClosed(true);

                // Dynamically import or call confetti using the saved coordinates
                // We use the global window.confetti if canvas-confetti is loaded, 
                // or just call our wrapper passing a dummy element with similar coords
                const dummyEl = document.createElement("div");
                dummyEl.style.position = "fixed";
                dummyEl.style.left = `${rect.left}px`;
                dummyEl.style.top = `${rect.top}px`;
                dummyEl.style.width = `${rect.width}px`;
                dummyEl.style.height = `${rect.height}px`;
                document.body.appendChild(dummyEl);

                await launchFirework(dummyEl);
                document.body.removeChild(dummyEl);

                setTimeout(() => {
                  openAnimation(10);
                }, 300);
              }, 800);
            }}
          >
            <i className="fa-solid fa-envelope-open me-2"></i>
            Mở thiệp mời
          </button>

        </div>
      </div>
    </div>
  );
}
