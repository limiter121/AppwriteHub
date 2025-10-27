"use client";

import { useEffect, useMemo, useRef } from "react";

export default function TextFlip({ words }) {
  //   const words = useMemo(() => ["fantastic", "love", "fire", "awesome", "fantastic"], []);

  const tallestRef = useRef(null);

  useEffect(() => {
    if (tallestRef.current) {
      let maxHeight = 0;

      words.forEach((word) => {
        const span = document.createElement("span");
        span.className = "absolute opacity-0";
        span.textContent = word;
        tallestRef.current?.appendChild(span);
        const height = span.offsetHeight;
        tallestRef.current?.removeChild(span);

        if (height > maxHeight) {
          maxHeight = height;
        }
      });

      tallestRef.current.style.height = `${maxHeight}px`;
      tallestRef.current.classList.remove("sr-only");
    }
  }, [words]);

  return (
    <div
      ref={tallestRef}
      className="inline-flex flex-col overflow-hidden sr-only"
    >
      {words.map((word, index) => (
        <span key={index} className="animate-flip-words">
          {word}
        </span>
      ))}
    </div>
  );
}
