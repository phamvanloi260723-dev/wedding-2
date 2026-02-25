"use client";

import { video } from "./video";
import { image } from "./image";
import { audio } from "./audio";
import { progress } from "./progress";
import {
  escapeHtml,
  safeInnerHTML,
  changeOpacity,
  timeOut,
  debounce,
} from "../common/util";
import { bs } from "../libs/bootstrap";
import { loader } from "../libs/loader";
import { theme } from "../common/theme";
import { lang } from "../common/language";
import { storage } from "../common/storage";
import { session } from "../common/session";
import { offline } from "../common/offline";
import { comment } from "../components/comment";
import * as confetti from "../libs/confetti";
import { pool } from "../connection/request";

let information: ReturnType<typeof storage> | null = null;
let config: ReturnType<typeof storage> | null = null;

const countDownDate = () => {
  const count = new Date(
    document.body.getAttribute("data-time")!.replace(" ", "T"),
  ).getTime();

  const pad = (num: number): string => (num < 10 ? `0${num}` : `${num}`);

  const day = document.getElementById("day");
  const hour = document.getElementById("hour");
  const minute = document.getElementById("minute");
  const second = document.getElementById("second");

  const updateCountdown = () => {
    const distance = Math.abs(count - Date.now());

    if (day)
      day.textContent = pad(Math.floor(distance / (1000 * 60 * 60 * 24)));
    if (hour)
      hour.textContent = pad(
        Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      );
    if (minute)
      minute.textContent = pad(
        Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
      );
    if (second)
      second.textContent = pad(Math.floor((distance % (1000 * 60)) / 1000));

    timeOut(updateCountdown, 1000 - (Date.now() % 1000));
  };

  timeOut(updateCountdown);
};

const showGuestName = () => {
  const raw = window.location.search.split("to=");
  let name: string | null = null;

  if (raw.length > 1 && raw[1].length >= 1) {
    name = window.decodeURIComponent(raw[1]);
  }

  if (name) {
    const guestName = document.getElementById("guest-name");
    const div = document.createElement("div");
    div.classList.add("m-2");

    const template = `<small class="mt-0 mb-1 mx-0 p-0">${escapeHtml(guestName?.getAttribute("data-message") ?? "")}</small><p class="m-0 p-0" style="font-size: 1.25rem">${escapeHtml(name)}</p>`;
    safeInnerHTML(div, template);

    guestName?.appendChild(div);
  }

  const form = document.getElementById("form-name") as HTMLInputElement | null;
  if (form) {
    form.value = information!.get("name") ?? name ?? "";
  }
};

const slide = async () => {
  const interval = 6000;
  const slides = document.querySelectorAll(".slide-desktop");

  if (!slides || slides.length === 0) {
    return;
  }

  const desktopEl = document
    .getElementById("root")
    ?.querySelector(".d-sm-block") as HTMLElement | null;
  if (!desktopEl) {
    return;
  }

  desktopEl.dispatchEvent(new Event("undangan.slide.stop"));

  if (window.getComputedStyle(desktopEl).display === "none") {
    return;
  }

  if (slides.length === 1) {
    await changeOpacity(slides[0] as HTMLElement, true);
    return;
  }

  let index = 0;
  for (const [i, s] of slides.entries()) {
    if (i === index) {
      s.classList.add("slide-desktop-active");
      await changeOpacity(s as HTMLElement, true);
      break;
    }
  }

  let run = true;
  const nextSlide = async () => {
    await changeOpacity(slides[index] as HTMLElement, false);
    slides[index].classList.remove("slide-desktop-active");

    index = (index + 1) % slides.length;

    if (run) {
      slides[index].classList.add("slide-desktop-active");
      await changeOpacity(slides[index] as HTMLElement, true);
    }

    return run;
  };

  desktopEl.addEventListener("undangan.slide.stop", () => {
    run = false;
  });

  const loop = async () => {
    if (await nextSlide()) {
      timeOut(loop, interval);
    }
  };

  timeOut(loop, interval);
};

const open = (button: HTMLButtonElement) => {
  button.disabled = true;
  document.body.scrollIntoView({ behavior: "instant" as ScrollBehavior });
  document.getElementById("root")?.classList.remove("opacity-0");

  if (theme.isAutoMode()) {
    document.getElementById("button-theme")?.classList.remove("d-none");
  }

  slide();
  theme.spyTop();

  confetti.basicAnimation();
  timeOut(confetti.openAnimation, 1500);

  document.dispatchEvent(new Event("undangan.open"));
  changeOpacity(document.getElementById("welcome")!, false).then(
    (el: HTMLElement) => el.remove(),
  );
};

const modal = (img: HTMLImageElement) => {
  document.getElementById("button-modal-click")?.setAttribute("href", img.src);
  document
    .getElementById("button-modal-download")
    ?.setAttribute("data-src", img.src);

  const i = document.getElementById("show-modal-image") as HTMLImageElement;
  i.src = img.src;
  i.width = img.width;
  i.height = img.height;
  bs.modal("modal-image").show();
};

const modalImageClick = () => {
  document
    .getElementById("show-modal-image")
    ?.addEventListener("click", (e) => {
      const abs = (e.currentTarget as HTMLElement).parentNode?.querySelector(
        ".position-absolute",
      ) as HTMLElement;

      if (abs) {
        abs.classList.contains("d-none")
          ? abs.classList.replace("d-none", "d-flex")
          : abs.classList.replace("d-flex", "d-none");
      }
    });
};

const showStory = (div: HTMLDivElement) => {
  if (navigator.vibrate) {
    navigator.vibrate(500);
  }

  confetti.tapTapAnimation(div, 100);
  changeOpacity(div, false).then((e: HTMLElement) => e.remove());
};

const closeInformation = () => information!.set("info", true);

const normalizeArabicFont = () => {
  document.querySelectorAll(".font-arabic").forEach((el) => {
    el.innerHTML = String(el.innerHTML).normalize("NFC");
  });
};

const animateSvg = () => {
  document.querySelectorAll("svg").forEach((el) => {
    if (el.hasAttribute("data-class")) {
      timeOut(
        () => el.classList.add(el.getAttribute("data-class")!),
        parseInt(el.getAttribute("data-time")!),
      );
    }
  });
};

const buildGoogleCalendar = () => {
  const formatDate = (d: string): string =>
    new Date(d.replace(" ", "T") + ":00Z")
      .toISOString()
      .replace(/[-:]/g, "")
      .split(".")
      .shift()!;

  const url = new URL("https://calendar.google.com/calendar/render");
  const data = new URLSearchParams({
    action: "TEMPLATE",
    text: "The Wedding of Wahyu and Riski",
    dates: `${formatDate("2023-03-15 10:00")}/${formatDate("2023-03-15 11:00")}`,
    details:
      "Tanpa mengurangi rasa hormat, kami mengundang Anda untuk berkenan menghadiri acara pernikahan kami. Terima kasih atas perhatian dan doa restu Anda, yang menjadi kebahagiaan serta kehormatan besar bagi kami.",
    location:
      "RT 10 RW 02, Desa Pajerukan, Kec. Kalibagor, Kab. Banyumas, Jawa Tengah 53191.",
    ctz: config!.get("tz") ?? "Asia/Jakarta",
  });

  url.search = data.toString();
  document
    .querySelector("#home button")
    ?.addEventListener("click", () => window.open(url.toString(), "_blank"));
};

const loaderLibs = () => {
  progress.add();

  const load = (opt: { aos?: boolean; confetti?: boolean }) => {
    loader(opt)
      .then(() => progress.complete("libs"))
      .catch(() => progress.invalid("libs"));
  };

  return { load };
};

const booting = async () => {
  animateSvg();
  countDownDate();
  showGuestName();
  modalImageClick();
  normalizeArabicFont();
  buildGoogleCalendar();

  if (information!.has("presence")) {
    (document.getElementById("form-presence") as HTMLSelectElement).value =
      information!.get("presence") ? "1" : "2";
  }

  if (information!.get("info")) {
    document.getElementById("information")?.remove();
  }
};

const pageLoaded = () => {
  lang.init();
  offline.init();
  comment.init();
  progress.init();

  config = storage("config");
  information = storage("information");

  const vid = video.init();
  const img = image.init();
  const aud = audio.init();
  const lib = loaderLibs();
  const token = document.body.getAttribute("data-key");
  const params = new URLSearchParams(window.location.search);

  window.addEventListener("resize", debounce(slide));
  document.addEventListener("undangan.progress.done", () => booting());
  document.addEventListener("hide.bs.modal", () =>
    (document.activeElement as HTMLElement)?.blur(),
  );
  document
    .getElementById("button-modal-download")
    ?.addEventListener("click", (e) => {
      img.download((e.currentTarget as HTMLElement).getAttribute("data-src")!);
    });

  if (!token || token.length <= 0) {
    document.getElementById("comment")?.remove();
    document
      .querySelector('a.nav-link[href="#comment"]')
      ?.closest("li.nav-item")
      ?.remove();

    vid.load();
    img.load();
    aud.load();
    lib.load({
      confetti: document.body.getAttribute("data-confetti") === "true",
    });
  }

  if (token && token.length > 0) {
    progress.add();
    progress.add();

    if (!img.hasDataSrc()) {
      img.load();
    }

    session
      .guest(params.get("k") ?? token)
      .then(({ data }: any) => {
        document.dispatchEvent(new Event("undangan.session"));
        progress.complete("config");

        if (img.hasDataSrc()) {
          img.load();
        }

        vid.load();
        aud.load();
        lib.load({ confetti: data.is_confetti_animation });

        comment
          .show()
          .then(() => progress.complete("comment"))
          .catch(() => progress.invalid("comment"));
      })
      .catch(() => progress.invalid("config"));
  }
};

let initialized = false;
let loadHandler: (() => void) | null = null;

const startPool = () => {
  pool.init(pageLoaded, ["image", "video", "audio", "libs", "gif"]);
};

const initGuest = () => {
  if (initialized) {
    return {
      theme,
      comment,
      guest: {
        open,
        modal,
        showStory,
        closeInformation,
      },
    };
  }

  initialized = true;
  theme.init();
  session.init();

  if (session.isAdmin()) {
    storage("user").clear();
    storage("owns").clear();
    storage("likes").clear();
    storage("session").clear();
    storage("comment").clear();
  }

  if (document.readyState === "complete") {
    // Page already loaded (common in Next.js SPA)
    startPool();
  } else {
    loadHandler = () => startPool();
    window.addEventListener("load", loadHandler);
  }

  return {
    theme,
    comment,
    guest: {
      open,
      modal,
      showStory,
      closeInformation,
    },
  };
};

const destroyGuest = () => {
  initialized = false;
  if (loadHandler) {
    window.removeEventListener("load", loadHandler);
    loadHandler = null;
  }
};

export const guest = {
  init: initGuest,
  destroy: destroyGuest,
};
