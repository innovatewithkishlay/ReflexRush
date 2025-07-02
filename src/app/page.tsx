"use client";

import React, { useState, useEffect, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import Circle from "../components/Circle";
import ScoreBoard from "../components/ScoreBoard";
import Timer from "../components/Timer";
import { getHighScore, setHighScore } from "../utils/localScore";

const GAME_DURATION = 30; // seconds
const CIRCLE_APPEAR_INTERVAL = 1500; // ms, time between circles
const CIRCLE_VISIBLE_TIME = 1200; // ms, how long each circle stays visible

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  const [gameActive, setGameActive] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScoreState] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [circle, setCircle] = useState<{ x: number; y: number; key: number } | null>(null);
  const [showCircle, setShowCircle] = useState(false);
  const circleKey = useRef(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const appearTimeout = useRef<NodeJS.Timeout | null>(null);
  const visibleTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setMounted(true);
    setHighScoreState(getHighScore());
  }, []);

  useEffect(() => {
    if (!gameActive) return;
    timerRef.current = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [gameActive]);

  useEffect(() => {
    if (gameActive && timeLeft <= 0) endGame();
  }, [timeLeft, gameActive]);

  useEffect(() => {
    if (!gameActive) return;
    spawnCircle();
    return clearTimeouts;
    // eslint-disable-next-line
  }, [gameActive]);

  const startGame = () => {
    setScore(0);
    setTimeLeft(GAME_DURATION);
    setGameActive(true);
    setCircle(null);
    setShowCircle(false);
    circleKey.current = 0;
  };

  const endGame = () => {
    setGameActive(false);
    setCircle(null);
    setShowCircle(false);
    if (score > highScore) {
      setHighScore(score);
      setHighScoreState(score);
    }
    clearTimeouts();
  };

  const spawnCircle = () => {
    setShowCircle(false);
    appearTimeout.current = setTimeout(() => {
      let x = 100, y = 100;
      if (typeof window !== "undefined") {
        const padding = 80;
        const circleSize = 96; // w-24 = 96px
        const width = Math.max(0, window.innerWidth - padding * 2 - circleSize);
        const height = Math.max(0, window.innerHeight - 180 - circleSize);
        x = Math.floor(Math.random() * width + padding);
        y = Math.floor(Math.random() * height + padding + 60);
      }
      circleKey.current += 1;
      setCircle({ x, y, key: circleKey.current });
      setShowCircle(true);
      visibleTimeout.current = setTimeout(() => {
        setShowCircle(false);
        spawnCircle();
      }, CIRCLE_VISIBLE_TIME);
    }, CIRCLE_APPEAR_INTERVAL - CIRCLE_VISIBLE_TIME);
  };

  const clearTimeouts = () => {
    if (appearTimeout.current) clearTimeout(appearTimeout.current);
    if (visibleTimeout.current) clearTimeout(visibleTimeout.current);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const handleCircleTap = () => {
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
        <Timer time={timeLeft} />
      </div>
      <div className="flex flex-col items-center justify-center w-full h-full pt-24">
        {!gameActive && (
          <div className="flex flex-col items-center gap-4">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-neon mb-4">ReflexRush</h1>
            {timeLeft !== GAME_DURATION && (
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
              {timeLeft === GAME_DURATION ? "Start Game" : "Restart"}
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
