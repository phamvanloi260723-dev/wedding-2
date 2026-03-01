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
            className="wedding-avatar rounded-circle shadow mb-5 mt-5"
            style={{
              border: '3px solid rgba(100, 149, 210, 0.45)',
              boxShadow: '0 0 30px rgba(100, 149, 210, 0.2), 0 4px 24px rgba(0,0,0,0.12)'
            }}
            onError={() => setImageSrc(default_img.src)}
          />

          <h2 className="font-primary wedding-names mb-5" style={{ fontSize: 'clamp(2.6rem, 8vw, 4.2rem)' }}>
            <span className="name-left">{siteConfig.groomName}</span>
            {/* <span className="heart-wrapper"> */}
            <span className="heart-icon">❤</span>
            {/* </span> */}
            <span className="name-right">{siteConfig.brideName}</span>
          </h2>

          <div
            id="guest-name"
            data-message="Kính mời quý vị quan khách"
            className="mb-"
          ></div>


          <button
            type="button"
            className="btn shadow rounded-pill mt-3 mx-auto px-4 py-2"
            style={{
              background: 'linear-gradient(135deg, rgba(74, 122, 181, 0.15) 0%, rgba(201, 169, 110, 0.15) 100%)',
              border: '1px solid rgba(100, 149, 210, 0.5)',
              color: 'inherit',
              fontFamily: '"Cormorant Garamond", serif',
              fontWeight: 500,
              fontSize: '1rem',
              letterSpacing: '2px',
              backdropFilter: 'blur(4px)',
              transition: 'all 0.4s ease',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 8px 28px rgba(74, 122, 181, 0.25)';
              (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-3px)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.boxShadow = '';
              (e.currentTarget as HTMLButtonElement).style.transform = '';
            }}
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
