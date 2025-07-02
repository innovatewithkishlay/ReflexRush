"use client";

import React, { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Circle from "../components/Circle";
import ScoreBoard from "../components/ScoreBoard";
import { getHighScore, setHighScore } from "../utils/localScore";

function getLevel(score: number) {
  if (score >= 45) return 10;
  if (score >= 40) return 9;
  if (score >= 35) return 8;
  if (score >= 30) return 7;
  if (score >= 25) return 6;
  if (score >= 20) return 5;
  if (score >= 15) return 4;
  if (score >= 10) return 3;
  if (score >= 5) return 2;
  return 1;
}

function getTiming(level: number) {
  switch (level) {
    case 2: return { interval: 1300, visible: 1100 };
    case 3: return { interval: 1150, visible: 950 };
    case 4: return { interval: 1000, visible: 850 };
    case 5: return { interval: 900, visible: 750 };
    case 6: return { interval: 800, visible: 650 };
    case 7: return { interval: 700, visible: 550 };
    case 8: return { interval: 600, visible: 450 };
    case 9: return { interval: 500, visible: 400 };
    case 10: return { interval: 450, visible: 350 };
    default: return { interval: 1500, visible: 1200 };
  }
}

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  const [gameActive, setGameActive] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScoreState] = useState(0);
  const [maxLevel, setMaxLevelState] = useState(1);
  const [circle, setCircle] = useState<{ x: number; y: number; key: number } | null>(null);
  const [showCircle, setShowCircle] = useState(false);
  const [level, setLevel] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  const [celebrate, setCelebrate] = useState(false);
  const [lives, setLives] = useState(3);
  const [showPrompt, setShowPrompt] = useState(false);
  const circleKey = useRef(0);
  const appearTimeout = useRef<NodeJS.Timeout | null>(null);
  const visibleTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setMounted(true);
    const savedScore = getHighScore();
    setHighScoreState(savedScore || 0);
    const savedLevel = parseInt(localStorage.getItem("maxLevel") || "1");
    setMaxLevelState(savedLevel);
  }, []);

  useEffect(() => {
    setLevel(getLevel(score));
  }, [score]);

  useEffect(() => {
    if (!gameActive) return;
    spawnCircle();
    return clearTimeouts;
  }, [gameActive, level]);

  const startGame = () => {
    setScore(0);
    setGameActive(true);
    setGameOver(false);
    setCircle(null);
    setShowCircle(false);
    setCelebrate(false);
    setLevel(1);
    setLives(3);
    circleKey.current = 0;
  };

  const endGame = () => {
    setGameActive(false);
    setGameOver(true);
    setCircle(null);
    setShowCircle(false);

    let newCelebrate = false;
    if (score > highScore) {
      setHighScore(score);
      setHighScoreState(score);
      newCelebrate = true;
    }
    if (level > maxLevel) {
      localStorage.setItem("maxLevel", String(level));
      setMaxLevelState(level);
      newCelebrate = true;
    }
    setCelebrate(newCelebrate);
    clearTimeouts();
  };

  const spawnCircle = () => {
    if (appearTimeout.current) clearTimeout(appearTimeout.current);
    if (visibleTimeout.current) clearTimeout(visibleTimeout.current);
    setShowCircle(false);
    const { interval, visible } = getTiming(level);
    appearTimeout.current = setTimeout(() => {
      let x = 100, y = 100;
      if (typeof window !== "undefined") {
        const padding = 80;
        const circleSize = 128;
        const width = Math.max(0, window.innerWidth - padding * 2 - circleSize);
        const height = Math.max(0, window.innerHeight - 180 - circleSize);
        x = Math.floor(Math.random() * width + padding);
        y = Math.floor(Math.random() * height + padding + 60);
      }
      circleKey.current += 1;
      setCircle({ x, y, key: circleKey.current });
      setShowCircle(true);
      visibleTimeout.current = setTimeout(() => {
        if (lives > 1) {
          setShowPrompt(true);
          setGameActive(false);
        } else {
          endGame();
        }
      }, visible);
    }, interval - visible);
  };

  const clearTimeouts = () => {
    if (appearTimeout.current) clearTimeout(appearTimeout.current);
    if (visibleTimeout.current) clearTimeout(visibleTimeout.current);
  };

  const handleCircleTap = () => {
    if (visibleTimeout.current) clearTimeout(visibleTimeout.current);
    setScore((s) => s + 1);
    setShowCircle(false);
    spawnCircle();
  };

  const handleContinue = () => {
    setLives(lives - 1);
    setShowPrompt(false);
    setGameActive(true);
    spawnCircle();
  };

  const handleQuit = () => {
    setShowPrompt(false);
    endGame();
  };

  useEffect(() => () => clearTimeouts(), []);

  if (!mounted) return null;

  return (
    <main className={`min-h-screen flex flex-col items-center justify-start relative overflow-hidden transition-colors duration-500
      ${level >= 8 ? "bg-gradient-to-b from-purple-900 to-black"
      : level >= 5 ? "bg-gradient-to-b from-pink-900 to-black"
      : "bg-black"}`}>
      <div className="w-full flex justify-between items-center px-6 py-4 fixed top-0 left-0 z-20">
        <ScoreBoard score={score} highScore={highScore} animate={gameActive} />
        <div className="text-lg font-bold text-pink-300 ml-4">Level {level}</div>
        <div className="text-white ml-4">❤️ {lives}</div>
      </div>

      <div className="flex flex-col items-center justify-center w-full h-full pt-24">
        {!gameActive && !showPrompt && (
          <div className="flex flex-col items-center gap-4">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-neon mb-4">ReflexRush</h1>
            {gameOver && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xl text-pink-400 font-bold text-center"
              >
                Game Over!
                <br />
                <span className="text-white">Score: {score}</span>
                <br />
                <span className="text-pink-200">High Score: {highScore}</span>
                <br />
                <span className="text-pink-200">Max Level: {maxLevel}</span>
              </motion.div>
            )}
            {celebrate && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="text-2xl font-extrabold text-yellow-300 mt-4"
              >
                🎉 New Record!
              </motion.div>
            )}
            <button
              className="mt-6 px-8 py-3 bg-pink-600 text-white rounded-full text-xl font-bold shadow-lg hover:bg-pink-500 transition"
              onClick={startGame}
            >
              {gameOver ? "Restart" : "Start Game"}
            </button>
          </div>
        )}

        {showPrompt && (
          <div className="flex flex-col items-center justify-center bg-black bg-opacity-90 fixed inset-0 z-50 text-center p-4">
            <div className="text-white text-2xl font-bold mb-4">You missed!</div>
            <div className="text-pink-200 mb-4">You have {lives} lives left. Continue?</div>
            <div className="flex gap-4">
              <button onClick={handleContinue} className="bg-green-500 px-6 py-2 rounded text-white font-bold">Continue</button>
              <button onClick={handleQuit} className="bg-red-500 px-6 py-2 rounded text-white font-bold">Quit</button>
            </div>
          </div>
        )}

        <div className="relative w-full h-[70vh] flex-1">
          <AnimatePresence>
            {gameActive && showCircle && circle && (
              <Circle
                key={circle.key}
                x={circle.x}
                y={circle.y}
                onTap={handleCircleTap}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}
