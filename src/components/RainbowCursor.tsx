import React, { useEffect, useRef } from "react";

const RainbowCursor: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    const onMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      cursor.style.left = `${clientX}px`;
      cursor.style.top = `${clientY}px`;
    };

    document.addEventListener("mousemove", onMouseMove);

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className="fixed pointer-events-none z-50 w-12 h-12 rounded-full mix-blend-screen"
      style={{
        background:
          "radial-gradient(circle, red, orange, yellow, green, blue, indigo, violet)",
        filter: "blur(8px)",
        transition: "transform 0.1s ease",
      }}
    />
  );
};

export default RainbowCursor;
