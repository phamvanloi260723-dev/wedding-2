"use client";

import { useEffect, useState } from "react";

const HEART_PATH =
  "m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143q.09.083.176.171a3 3 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15";

export default function LoveAnimation({
  top,
  left,
  right,
  time,
  wrapper,
}: {
  top: string;
  left?: string;
  right?: string;
  time: number;
  wrapper?: boolean;
}) {
  const [animatedClass, setAnimatedClass] = useState("");

  useEffect(() => {
    const t = setTimeout(() => {
      setAnimatedClass("animate-love");
    }, time);
    return () => clearTimeout(t);
  }, [time]);

  const style: React.CSSProperties = { top };
  if (left) style.left = left;
  if (right) style.right = right;

  const inner = (
    <div className="position-absolute" style={style}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="40"
        height="40"
        fill="currentColor"
        className={`opacity-50 ${animatedClass}`}
        data-time={String(time)}
        data-class="animate-love"
        viewBox="0 0 16 16"
      >
        <path d={HEART_PATH} />
      </svg>
    </div>
  );

  if (wrapper) {
    return <div className="position-relative">{inner}</div>;
  }

  return inner;
}
