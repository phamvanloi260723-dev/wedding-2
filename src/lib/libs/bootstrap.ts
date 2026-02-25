"use client";

declare global {
  interface Window {
    bootstrap: any;
  }
}

export const bs = {
  modal: (id: string) => {
    return window.bootstrap.Modal.getOrCreateInstance(
      document.getElementById(id),
    );
  },
  tab: (id: string) => {
    return window.bootstrap.Tab.getOrCreateInstance(
      document.getElementById(id),
    );
  },
};
