"use client";

import { useEffect, useRef, useState } from "react";
import { siteConfig } from "@/config/site";

export function useAudio() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Create audio element only once
    const audio = new Audio(siteConfig.audioUrl);
    audio.loop = true;
    audioRef.current = audio;

    return () => {
      audio.pause();
      audioRef.current = null;
    };
  }, []);

  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(err => {
        console.warn("Audio play blocked by browser:", err);
        setIsPlaying(false);
      });
    }
  };

  const playAudio = () => {
    if (!audioRef.current) return;
    if (!isPlaying) {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(err => {
        console.warn("Audio play blocked by browser:", err);
      });
    }
  };

  const pauseAudio = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  return { isPlaying, toggleAudio, playAudio, pauseAudio };
}
