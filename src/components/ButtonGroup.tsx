"use client";

import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    undangan: any;
  }
}

export default function ButtonGroup({ opened }: { opened: boolean }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);

  // Khi mở thiệp -> tự chạy nhạc
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !opened) return;

    const playMusic = async () => {
      try {
        await audio.play();
        setPlaying(true);
      } catch (err) {
        console.log("Autoplay bị chặn:", err);
      }
    };

    playMusic();
  }, [opened]);

  const toggleMusic = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      await audio.play();
      setPlaying(true);
    }
  };

  return (
    <>
      {/* AUDIO */}
      <audio
        ref={audioRef}
        src="/assets/music/i_do-duc_phuc.mp3"
        loop
        preload="auto"
      />

      <div
        className="d-flex position-fixed flex-column"
        style={{ bottom: "10vh", right: "2vh", zIndex: 1030 }}
      >
        <button
          type="button"
          className="btn bg-light-dark border btn-sm rounded-circle shadow-sm mt-3"
          onClick={() => window.undangan?.theme.change()}
        >
          <i className="fa-solid fa-circle-half-stroke"></i>
        </button>

        <button
          type="button"
          onClick={toggleMusic}
          className="btn bg-light-dark border btn-sm rounded-circle shadow-sm mt-3"
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