"use client";

import { storage } from "./storage";

const themeColors: Record<string, string> = {
  "#000000": "#ffffff",
  "#ffffff": "#000000",
  "#212529": "#f8f9fa",
  "#f8f9fa": "#212529",
};
const themeLight = ["#ffffff", "#f8f9fa"];
const themeDark = ["#000000", "#212529"];

let isAuto = false;
let themes: ReturnType<typeof storage> | null = null;
let metaTheme: HTMLMetaElement | null = null;

const setLight = () => themes?.set("active", "light");
const setDark = () => themes?.set("active", "dark");

const setMetaTheme = (listTheme: string[]) => {
  if (!metaTheme) return;
  const now = metaTheme.getAttribute("content") || "";
  metaTheme.setAttribute(
    "content",
    listTheme.some((i) => i === now) ? themeColors[now] : now,
  );
};

const onLight = () => {
  setLight();
  document.documentElement.setAttribute("data-bs-theme", "light");
  setMetaTheme(themeDark);
};

const onDark = () => {
  setDark();
  document.documentElement.setAttribute("data-bs-theme", "dark");
  setMetaTheme(themeLight);
};

export const isDarkMode = (
  dark: string | null = null,
  light: string | null = null,
): any => {
  const status = themes?.get("active") === "dark";
  if (dark && light) return status ? dark : light;
  return status;
};

export const changeTheme = () => (isDarkMode() ? onLight() : onDark());

export const isAutoMode = () => isAuto;

export const spyTop = () => {
  const callback = (es: IntersectionObserverEntry[]) =>
    es
      .filter((e) => e.isIntersecting)
      .forEach((e) => {
        const themeColor = (e.target as HTMLElement).classList.contains(
          "bg-white-black",
        )
          ? isDarkMode(themeDark[0], themeLight[0])
          : isDarkMode(themeDark[1], themeLight[1]);
        metaTheme?.setAttribute("content", themeColor);
      });

  const observerTop = new IntersectionObserver(callback, {
    rootMargin: "0% 0% -95% 0%",
  });
  document.querySelectorAll("section").forEach((e) => observerTop.observe(e));
};

export const initTheme = () => {
  themes = storage("theme");
  metaTheme = document.querySelector('meta[name="theme-color"]');

  if (!themes.has("active")) {
    window.matchMedia("(prefers-color-scheme: dark)").matches
      ? setDark()
      : setLight();
  }

  switch (document.documentElement.getAttribute("data-bs-theme")) {
    case "dark":
      setDark();
      break;
    case "light":
      setLight();
      break;
    default:
      isAuto = true;
  }

  if (isDarkMode()) {
    onDark();
  } else {
    onLight();
  }
};

export const theme = {
  init: initTheme,
  spyTop,
  change: changeTheme,
  isDarkMode,
  isAutoMode,
};
