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
      className="absolute w-24 h-24 rounded-full bg-pink-500 shadow-neon border-4 border-pink-300"
      style={{ left: x, top: y, boxShadow: "0 0 40px 10px #ec4899, 0 0 0 4px #fff2" }}
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
