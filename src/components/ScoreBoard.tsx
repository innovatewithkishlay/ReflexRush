"use client";

import { motion, AnimatePresence } from "framer-motion";

type ScoreBoardProps = {
  score: number;
  highScore: number;
  animate: boolean;
};

export default function ScoreBoard({ score, highScore}: ScoreBoardProps) {
  return (
    <div className="flex flex-col items-start gap-1">
      <div className="flex items-end gap-2">
        <span className="text-lg text-gray-400">Score</span>
        <AnimatePresence>
          <motion.span
            key={score}
            className="text-3xl md:text-4xl font-bold text-pink-400 drop-shadow-neon"
            initial={{ scale: 1.2, opacity: 0 }}
            animate={{ scale: [1.2, 1.5, 1], opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.4, type: "spring" }}
          >
            {score}
          </motion.span>
        </AnimatePresence>
      </div>
      <div className="text-xs text-pink-200 font-semibold">High: {highScore}</div>
    </div>
  );
}
