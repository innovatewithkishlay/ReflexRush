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
      className="absolute w-28 h-28 rounded-full bg-pink-500 border-4 border-pink-300 shadow-neon z-50"
      style={{
        left: x,
        top: y,
        boxShadow: "0 0 16px 6px #ec4899, 0 0 0 4px #fff2" 
      }}
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
