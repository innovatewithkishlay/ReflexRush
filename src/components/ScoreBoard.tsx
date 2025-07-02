"use client";

import { motion, AnimatePresence } from "framer-motion";
import { FaTrophy } from "react-icons/fa";

type ScoreBoardProps = {
  score: number;
  highScore: number;
  animate: boolean;
};

export default function ScoreBoard({ score, highScore, }: ScoreBoardProps) {
  return (
    <motion.div
      className="backdrop-blur-xl bg-white/10 border border-pink-400/50 rounded-2xl shadow-lg px-8 py-5 flex flex-col items-start gap-2 min-w-[220px] relative"
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 180, damping: 22 }}
      style={{
        boxShadow: "0 2px 32px 0 #ec489966, 0 0 0 1px #fff2",
      }}
    >
      <div className="flex items-center gap-2 text-pink-100 text-sm font-medium mb-1">
        <span>Getting bored?</span>
        <span className="ml-1 text-pink-300 animate-pulse">Try to beat your high score!</span>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-lg text-gray-200">Score</span>
        <AnimatePresence>
          <motion.span
            key={score}
            className="text-3xl font-extrabold text-pink-400 drop-shadow-neon"
            initial={{ scale: 1.15, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3, type: "spring" }}
          >
            {score}
          </motion.span>
        </AnimatePresence>
      </div>
      <div className="flex items-center gap-2 mt-1">
        <FaTrophy className="text-yellow-400 drop-shadow" />
        <span className="text-xs text-pink-200 font-semibold">High: {highScore}</span>
      </div>
    </motion.div>
  );
}
