"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import '98.css';
import { motion } from 'framer-motion';

const GAME_WIDTH = 600;
const GAME_HEIGHT = 150;
const DINO_WIDTH = 44;
const DINO_HEIGHT = 47;
const CACTUS_WIDTH = 20;

const DinoGame = () => {
  const [dinoY, setDinoY] = useState(GAME_HEIGHT - DINO_HEIGHT);
  const [velocityY, setVelocityY] = useState(0);
  const [cacti, setCacti] = useState([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [started, setStarted] = useState(false);

  const GRAVITY = 0.8;
  const JUMP = -12;

  const generateCactus = () => ({ x: GAME_WIDTH });

  useEffect(() => {
    const handleKeyDown = (e) => { if (e.key === 'j' || e.key === ' ') jump(); };
    const handleClick = () => jump();
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('click', handleClick);
    return () => { window.removeEventListener('keydown', handleKeyDown); window.removeEventListener('click', handleClick); };
  }, []);

  const jump = () => { if (!started) setStarted(true); if (dinoY >= GAME_HEIGHT - DINO_HEIGHT) setVelocityY(JUMP); };

  useEffect(() => {
    if (!started || gameOver) return;
    const interval = setInterval(() => {
      setDinoY((y) => Math.min(y + velocityY, GAME_HEIGHT - DINO_HEIGHT));
      setVelocityY((v) => (dinoY < GAME_HEIGHT - DINO_HEIGHT ? v + GRAVITY : 0));

      setCacti((prev) => {
        const newCacti = prev.map(c => ({ ...c, x: c.x - 5 })).filter(c => c.x + CACTUS_WIDTH > 0);
        if (newCacti.length === 0 || newCacti[newCacti.length - 1].x < GAME_WIDTH - 200) newCacti.push(generateCactus());
        return newCacti;
      });

      cacti.forEach(c => {
        if (50 < c.x + CACTUS_WIDTH && 50 + DINO_WIDTH > c.x && dinoY + DINO_HEIGHT > GAME_HEIGHT - 20) {
          setGameOver(true);
          clearInterval(interval);
        }
        if (c.x + CACTUS_WIDTH === 50) setScore(s => s + 1);
      });
    }, 30);
    return () => clearInterval(interval);
  }, [dinoY, velocityY, cacti, started, gameOver]);

  const resetGame = () => { setDinoY(GAME_HEIGHT - DINO_HEIGHT); setVelocityY(0); setCacti([]); setScore(0); setGameOver(false); setStarted(false); };

  return (
    <motion.div className="window mx-auto my-4 w-full max-w-[600px] h-auto overflow-hidden flex flex-col items-center justify-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
      <div className="title-bar w-full flex justify-center items-center p-1 bg-gradient-to-r from-pink-500 to-pink-700">
        <div className="title-bar-text text-white text-center text-lg">Chrome Dino Clone</div>
      </div>
      <div className="window-body relative overflow-hidden flex justify-center items-center h-full w-full" style={{ aspectRatio: '4/1' }}>
        {gameOver && <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-700 bg-opacity-70 text-center z-20"><div className="text-4xl text-red-600">GAME OVER</div><button className="button mt-4" onClick={resetGame}>Try Again</button></div>}
        {!started && <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-700 bg-opacity-70 text-center z-20"><div className="text-2xl text-white mb-4">Press 'J' or Tap to Jump</div><button className="button" onClick={jump}>Start Game</button></div>}
        <div className="absolute z-30" style={{ left: '50px', bottom: '0', width: `${DINO_WIDTH}px`, height: `${DINO_HEIGHT}px` }}>
          <Image src="/assets/dino.png" alt="dino" width={DINO_WIDTH} height={DINO_HEIGHT} className="object-cover" />
        </div>
        {cacti.map((c, i) => (
          <Image key={i} src="/assets/cactus.png" alt="cactus" className="absolute z-10" style={{ left: `${c.x}px`, bottom: '0', width: `${CACTUS_WIDTH}px` }} width={CACTUS_WIDTH} height={30} />
        ))}
        <div className="absolute top-2 right-2 bg-gray-800 text-white px-2 py-1 rounded z-30">Score: {score}</div>
      </div>
    </motion.div>
  );
};

export default DinoGame;
