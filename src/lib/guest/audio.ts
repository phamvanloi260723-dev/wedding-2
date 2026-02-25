"use client";

import { progress } from "./progress";
import { notify } from "../common/util";
import { cache } from "../connection/cache";

const statePlay = '<i class="fa-solid fa-circle-pause spin-button"></i>';
const statePause = '<i class="fa-solid fa-circle-play"></i>';

export const audio = {
  init: () => {
    progress.add();
    return { load: audio.load };
  },

  load: async (playOnOpen: boolean = true) => {
    const url = document.body.getAttribute("data-audio");
    if (!url) {
      progress.complete("audio", true);
      return;
    }

    let audioEl: HTMLAudioElement | null = null;

    try {
      const c = cache("audio").withForceCache();
      audioEl = new Audio(await c.get(url, progress.getAbort()));
      audioEl.loop = true;
      audioEl.muted = false;
      audioEl.autoplay = false;
      audioEl.controls = false;
      progress.complete("audio");
    } catch {
      progress.invalid("audio");
      return;
    }

    let isPlay = false;
    const music = document.getElementById(
      "button-music",
    ) as HTMLButtonElement | null;

    const play = async () => {
      if (!navigator.onLine || !music) return;
      music.disabled = true;
      try {
        await audioEl!.play();
        isPlay = true;
        music.disabled = false;
        music.innerHTML = statePlay;
      } catch (err: any) {
        isPlay = false;
        notify(err).error();
      }
    };

    const pause = () => {
      isPlay = false;
      audioEl!.pause();
      if (music) music.innerHTML = statePause;
    };

    document.addEventListener("undangan.open", () => {
      music?.classList.remove("d-none");
      if (playOnOpen) play();
    });

    music?.addEventListener("offline", pause);
    music?.addEventListener("click", () => (isPlay ? pause() : play()));
  },
};
