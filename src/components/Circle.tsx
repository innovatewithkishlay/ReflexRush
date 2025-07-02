"use client";

import { motion } from "framer-motion";

type CircleProps = {
  x: number;
  y: number;
  onTap: () => void;
};

export default function Circle({ x, y, onTap }: CircleProps) {
  return (
    <motion.button
      className="absolute w-32 h-32 flex items-center justify-center rounded-full z-50 cursor-pointer"
      style={{ left: x, top: y, background: "transparent", border: "none" }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.7, opacity: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      onClick={onTap}
      onTouchStart={onTap}
      aria-label="Tap target"
    >
      <div className="w-28 h-28 rounded-full bg-pink-500 border-4 border-pink-300 shadow-neon" />
    </motion.button>
  );
}
