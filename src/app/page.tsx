"use client";

import React, { useState, useEffect, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import Circle from "../components/Circle";
import ScoreBoard from "../components/ScoreBoard";
import { getHighScore, setHighScore } from "../utils/localScore";

function getLevel(score: number) {
  if (score >= 15) return 4;
  if (score >= 10) return 3;
  if (score >= 5) return 2;
  return 1;
}

function getTiming(level: number) {
  switch (level) {
    case 2:
      return { interval: 1200, visible: 950 };
    case 3:
      return { interval: 1000, visible: 800 };
    case 4:
      return { interval: 800, visible: 650 };
    default:
      return { interval: 1500, visible: 1200 };
  }
}

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  const [gameActive, setGameActive] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScoreState] = useState(0);
  const [circle, setCircle] = useState<{ x: number; y: number; key: number } | null>(null);
  const [showCircle, setShowCircle] = useState(false);
  const [level, setLevel] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  const circleKey = useRef(0);
  const appearTimeout = useRef<NodeJS.Timeout | null>(null);
  const visibleTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setMounted(true);
    setHighScoreState(getHighScore());
  }, []);

  useEffect(() => {
    setLevel(getLevel(score));
  }, [score]);

  useEffect(() => {
    if (!gameActive) return;
    spawnCircle();
    return clearTimeouts;
    // eslint-disable-next-line
  }, [gameActive, level]);

  const startGame = () => {
    setScore(0);
    setGameActive(true);
    setGameOver(false);
    setCircle(null);
    setShowCircle(false);
    setLevel(1);
    circleKey.current = 0;
  };

  const endGame = () => {
    setGameActive(false);
    setGameOver(true);
    setCircle(null);
    setShowCircle(false);
    if (score > highScore) {
      setHighScore(score);
      setHighScoreState(score);
    }
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
        const circleSize = 96;
        const width = Math.max(0, window.innerWidth - padding * 2 - circleSize);
        const height = Math.max(0, window.innerHeight - 180 - circleSize);
        x = Math.floor(Math.random() * width + padding);
        y = Math.floor(Math.random() * height + padding + 60);
      }
      circleKey.current += 1;
      setCircle({ x, y, key: circleKey.current });
      setShowCircle(true);
      visibleTimeout.current = setTimeout(() => {
        // Missed the circle: knockout
        endGame();
      }, visible);
    }, interval - visible);
  };

  const clearTimeouts = () => {
    if (appearTimeout.current) clearTimeout(appearTimeout.current);
    if (visibleTimeout.current) clearTimeout(visibleTimeout.current);
  };

  const handleCircleTap = () => {
    if (visibleTimeout.current) clearTimeout(visibleTimeout.current); // Clear miss timeout
    setScore(s => s + 1);
    setShowCircle(false);
    spawnCircle();
  };

  useEffect(() => () => clearTimeouts(), []);

  if (!mounted) return null;

  return (
    <main className="min-h-screen bg-black flex flex-col items-center justify-start relative overflow-hidden">
      <div className="w-full flex justify-between items-center px-6 py-4 fixed top-0 left-0 z-20">
        <ScoreBoard score={score} highScore={highScore} animate={gameActive} />
        {gameActive && (
          <div className="text-lg font-bold text-pink-300 ml-4">Level {level}</div>
        )}
      </div>
      <div className="flex flex-col items-center justify-center w-full h-full pt-24">
        {!gameActive && (
          <div className="flex flex-col items-center gap-4">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-neon mb-4">ReflexRush</h1>
            {gameOver && (
              <div className="text-xl text-pink-400 font-bold">
                Game Over!<br />
                <span className="text-white">Score: {score}</span>
                <br />
                <span className="text-pink-200">High Score: {highScore}</span>
              </div>
            )}
            <button
              className="mt-6 px-8 py-3 bg-pink-600 text-white rounded-full text-xl font-bold shadow-lg hover:bg-pink-500 transition"
              onClick={startGame}
            >
              {gameOver ? "Restart" : "Start Game"}
            </button>
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
