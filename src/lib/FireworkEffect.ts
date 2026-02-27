"use client";

// @ts-ignore
import confetti from "canvas-confetti";

export const launchFirework = (element: HTMLElement) => {
  return new Promise<void>((resolve) => {
    const rect = element.getBoundingClientRect();

    const origin = {
      x: (rect.left + rect.width / 2) / window.innerWidth,
      y: (rect.top + rect.height / 2) / window.innerHeight,
    };

    const canvas = document.createElement("canvas");

    canvas.style.position = "fixed";
    canvas.style.top = "0";
    canvas.style.left = "0";
    canvas.style.width = "100vw";
    canvas.style.height = "100vh";
    canvas.style.pointerEvents = "none";
    canvas.style.zIndex = "999999";

    document.body.appendChild(canvas);

    const myConfetti = confetti.create(canvas, {
      resize: true,
      useWorker: true,
    });

    // 💥 Nhẹ nhàng hơn
    myConfetti({
      particleCount: 60,        // ít lại
      spread: 70,               // thu hẹp
      startVelocity: 45,        // bắn nhẹ
      scalar: 0.8,              // nhỏ lại
      gravity: 0.9,
      ticks: 120,
      origin,
    });

    // ✨ bắn thêm nhẹ 1 lần
    setTimeout(() => {
      myConfetti({
        particleCount: 40,
        spread: 90,
        startVelocity: 35,
        scalar: 0.7,
        gravity: 1,
        ticks: 100,
        origin,
      });
    }, 150);

    // ⏳ Rút ngắn còn ~1.2s
    setTimeout(() => {
      canvas.remove();
      resolve();
    }, 2000);
  });
};