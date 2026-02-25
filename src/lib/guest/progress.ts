"use client";

let info: HTMLElement | null = null;
let bar: HTMLElement | null = null;
let total = 0;
let loaded = 0;
let valid = true;
let cancelProgress: Promise<void> | null = null;

const showInformation = () =>
  `(${loaded}/${total}) [${parseInt(String((loaded / total) * 100)).toFixed(0)}%]`;

export const progress = {
  add: () => {
    total += 1;
  },
  complete: (type: string, skip: boolean = false) => {
    if (!valid) return;
    loaded += 1;
    if (info)
      info.innerText = `Loading ${type} ${skip ? "skipped" : "complete"} ${showInformation()}`;
    if (bar)
      bar.style.width = Math.min((loaded / total) * 100, 100).toString() + "%";

    if (loaded === total) {
      valid = false;
      cancelProgress = null;
      document.dispatchEvent(new Event("undangan.progress.done"));
    }
  },
  invalid: (type: string) => {
    if (valid) {
      valid = false;
      if (bar) bar.style.backgroundColor = "red";
      if (info) info.innerText = `Error loading ${type} ${showInformation()}`;
      document.dispatchEvent(new Event("undangan.progress.invalid"));
    }
  },
  getAbort: (): Promise<void> | null => cancelProgress,
  reset: () => {
    info = null;
    bar = null;
    total = 0;
    loaded = 0;
    valid = true;
    cancelProgress = null;
  },
  init: () => {
    total = 0;
    loaded = 0;
    valid = true;
    cancelProgress = null;
    info = document.getElementById("progress-info");
    bar = document.getElementById("progress-bar");
    if (info) info.classList.remove("d-none");
    cancelProgress = new Promise((res) =>
      document.addEventListener("undangan.progress.invalid", () => res()),
    );
  },
};
