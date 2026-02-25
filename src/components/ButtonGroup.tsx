"use client";

import { useRef, useState } from "react";

declare global {
  interface Window {
    undangan: any;
  }
}

export default function ButtonGroup() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);

  const toggleMusic = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      if (playing) {
        audio.pause();
        setPlaying(false);
      } else {
        await audio.play();
        setPlaying(true);
      }
    } catch (err) {
      console.log("Không thể phát nhạc:", err);
    }
  };

  return (
    <>
      {/* AUDIO */}
      <audio
        ref={audioRef}
        src="/assets/music/i_do-duc_phuc.mp3"
        loop
      />

      <div
        className="d-flex position-fixed flex-column"
        style={{ bottom: "10vh", right: "2vh", zIndex: 1030 }}
      >
        {/* THEME BUTTON */}
        <button
          type="button"
          id="button-theme"
          className="btn bg-light-dark border btn-sm rounded-circle shadow-sm mt-3"
          aria-label="Change theme"
          onClick={() => window.undangan?.theme.change()}
        >
          <i className="fa-solid fa-circle-half-stroke"></i>
        </button>

        {/* MUSIC BUTTON */}
        <button
          type="button"
          id="button-music"
          onClick={toggleMusic}
          className="btn bg-light-dark border btn-sm rounded-circle shadow-sm mt-3"
          aria-label="Change audio"
        >
          <i
            className={`fa-solid ${playing ? "fa-circle-pause spin-button" : "fa-circle-play"
              }`}
          ></i>
        </button>
      </div>
    </>
  );
}