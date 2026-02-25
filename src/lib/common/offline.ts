"use client";

import { changeOpacity, timeOut } from "./util";

let alertEl: HTMLDivElement | null = null;
let online = true;

const classes = [
  "input[data-offline-disabled]",
  "button[data-offline-disabled]",
  "select[data-offline-disabled]",
  "textarea[data-offline-disabled]",
];

export const isOnline = () => online;

const setOffline = () => {
  if (!alertEl) return;
  const el = alertEl.firstElementChild!.firstElementChild! as HTMLElement;
  el.classList.remove("bg-success");
  el.classList.add("bg-danger");
  el.firstElementChild!.innerHTML =
    '<i class="fa-solid fa-ban me-2"></i>Koneksi không tersedia';
};

const setOnline = () => {
  if (!alertEl) return;
  const el = alertEl.firstElementChild!.firstElementChild! as HTMLElement;
  el.classList.remove("bg-danger");
  el.classList.add("bg-success");
  el.firstElementChild!.innerHTML =
    '<i class="fa-solid fa-cloud me-2"></i>Koneksi tersedia kembali';
};

const setDefaultState = async () => {
  if (!online || !alertEl) return;
  await changeOpacity(alertEl, false);
  setOffline();
};

const changeState = () => {
  document.querySelectorAll(classes.join(", ")).forEach((e) => {
    const el = e as HTMLElement;
    el.dispatchEvent(new Event(isOnline() ? "online" : "offline"));
    el.setAttribute("data-offline-disabled", isOnline() ? "false" : "true");

    if (el.tagName === "BUTTON") {
      isOnline()
        ? el.classList.remove("disabled")
        : el.classList.add("disabled");
    } else {
      isOnline()
        ? el.removeAttribute("disabled")
        : el.setAttribute("disabled", "true");
    }
  });
};

const onOffline = () => {
  online = false;
  setOffline();
  if (alertEl) changeOpacity(alertEl, true);
  changeState();
};

const onOnline = () => {
  online = true;
  setOnline();
  timeOut(setDefaultState, 3000);
  changeState();
};

export const initOffline = () => {
  window.addEventListener("online", onOnline);
  window.addEventListener("offline", onOffline);

  alertEl = document.createElement("div");
  alertEl.classList.add("fixed-top", "pe-none");
  alertEl.style.cssText = "opacity: 0; z-index: 1057;";
  alertEl.innerHTML = `
    <div class="d-flex justify-content-center mx-auto">
      <div class="d-flex justify-content-center align-items-center rounded-pill my-2 bg-danger shadow">
        <small class="text-center py-1 px-2 mx-1 mt-1 mb-0 text-white" style="font-size: 0.8rem;"></small>
      </div>
    </div>`;

  document.body.insertBefore(alertEl, document.body.lastChild);
};

export const offline = {
  init: initOffline,
  isOnline,
};
