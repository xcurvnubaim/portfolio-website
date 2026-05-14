import { useEffect, useRef } from "react";
import { createStarfield } from "../lib/starfield.js";

export default function Background() {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) {
      return undefined;
    }

    return createStarfield(canvasRef.current).init();
  }, []);

  return (
    <>
      <canvas id="starfield" ref={canvasRef} aria-hidden="true" />
      <div className="cursor-dot" id="cursorDot" aria-hidden="true" />
      <div className="cursor-ring" id="cursorRing" aria-hidden="true" />
    </>
  );
}
