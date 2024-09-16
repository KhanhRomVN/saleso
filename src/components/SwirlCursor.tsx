import React, { useEffect, useRef } from "react";

interface SwirlCursorProps {
  excludeRef: React.RefObject<HTMLElement>;
}

const SwirlCursor: React.FC<SwirlCursorProps> = ({ excludeRef }) => {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const excludeElement = excludeRef.current;

    if (!cursor || !excludeElement) return;

    const onMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const target = e.target as HTMLElement;

      if (excludeElement.contains(target)) {
        cursor.style.opacity = "0";
      } else {
        cursor.style.opacity = "1";
        cursor.style.left = `${clientX}px`;
        cursor.style.top = `${clientY}px`;
      }
    };

    document.addEventListener("mousemove", onMouseMove);

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
    };
  }, [excludeRef]);

  return (
    <div
      ref={cursorRef}
      className="fixed pointer-events-none z-50 w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 mix-blend-screen"
      style={{
        transition: "opacity 0.3s ease, transform 0.3s ease",
        filter: "blur(5px)",
      }}
    />
  );
};

export default SwirlCursor;
