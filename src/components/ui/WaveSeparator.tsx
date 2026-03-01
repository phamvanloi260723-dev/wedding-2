"use client";

export default function WaveSeparator({ d, className }: { d: string; className?: string }) {
  return (
    <div className="svg-wrapper">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 320"
        className={`${className || "color-theme-svg"} no-gap-bottom`}
      >
        <path fill="currentColor" fillOpacity="1" d={d}></path>
      </svg>
    </div>
  );
}
