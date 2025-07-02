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
      className="absolute w-28 h-28 rounded-full bg-pink-500 border-4 border-pink-300 shadow-[0_0_20px_5px_rgba(255,105,180,0.7)] z-50 cursor-pointer"
      style={{ left: x, top: y }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.7, opacity: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      onClick={onTap}
      onTouchStart={onTap}
      aria-label="Tap target"
    />
  );
}
