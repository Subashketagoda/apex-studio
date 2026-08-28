"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function CustomCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [cursorType, setCursorType] = useState<"default" | "button" | "view" | "play">("default");
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    // Check if device is touch or small viewport
    const checkMobile = () => {
      const isTouch = window.matchMedia("(pointer: coarse)").matches || window.innerWidth < 1024;
      setIsMobile(isTouch);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    const handleMouseMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });

      const target = e.target as HTMLElement | null;
      if (!target) return;

      // Check for explicit data-cursor attributes
      const cursorAttr = target.closest("[data-cursor]")?.getAttribute("data-cursor");
      if (cursorAttr === "PLAY") {
        setCursorType("play");
        return;
      }
      if (cursorAttr === "VIEW") {
        setCursorType("view");
        return;
      }

      // Check for buttons / links
      if (target.closest("button, a, input, select, textarea, [role='button']")) {
        setCursorType("button");
        return;
      }

      // Check for gallery / images
      if (target.closest("#studio .group, #equipment .group")) {
        setCursorType("view");
        return;
      }

      // Check for portfolio / video items
      if (target.closest("#work .group")) {
        setCursorType("play");
        return;
      }

      setCursorType("default");
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("resize", checkMobile);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  if (isMobile) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[999] overflow-hidden">
      {/* Outer Dynamic Ring / Disc */}
      <motion.div
        animate={{
          x: pos.x,
          y: pos.y,
          width: cursorType === "view" || cursorType === "play" ? 70 : cursorType === "button" ? 44 : 26,
          height: cursorType === "view" || cursorType === "play" ? 70 : cursorType === "button" ? 44 : 26,
          backgroundColor:
            cursorType === "view" || cursorType === "play"
              ? "rgba(56, 189, 248, 0.95)"
              : cursorType === "button"
              ? "rgba(255, 255, 255, 0.15)"
              : "rgba(56, 189, 248, 0.05)",
          borderColor:
            cursorType === "view" || cursorType === "play"
              ? "rgba(56, 189, 248, 1)"
              : cursorType === "button"
              ? "rgba(56, 189, 248, 0.8)"
              : "rgba(56, 189, 248, 0.35)",
        }}
        transition={{ type: "spring", damping: 25, stiffness: 350, mass: 0.3 }}
        className="fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 rounded-full border backdrop-blur-[1px] flex items-center justify-center shadow-lg"
      >
        {cursorType === "view" && (
          <span className="text-[10px] font-mono font-bold tracking-wider text-black">
            VIEW
          </span>
        )}
        {cursorType === "play" && (
          <span className="text-[10px] font-mono font-bold tracking-wider text-black">
            PLAY
          </span>
        )}
      </motion.div>

      {/* Center Precision Dot */}
      {cursorType === "default" && (
        <motion.div
          animate={{ x: pos.x, y: pos.y }}
          transition={{ type: "spring", damping: 35, stiffness: 600, mass: 0.1 }}
          className="fixed top-0 left-0 w-1.5 h-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-[0_0_6px_#38bdf8]"
        />
      )}
    </div>
  );
}
