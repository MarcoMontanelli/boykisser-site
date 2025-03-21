"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import '98.css';
import { motion } from 'framer-motion';

const GAME_WIDTH = 400;
const GAME_HEIGHT = 600;
const BIRD_SIZE = 40;
const PIPE_WIDTH = 60;
const PIPE_GAP = 200;

const FlappyBird = () => {
  const [birdY, setBirdY] = useState(GAME_HEIGHT / 2);
  const [velocity, setVelocity] = useState(0);
  const [pipes, setPipes] = useState([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [started, setStarted] = useState(false);

  const GRAVITY = 1.8;
  const JUMP = -12;

  const generatePipe = () => {
    const gapPosition = Math.floor(Math.random() * (GAME_HEIGHT - PIPE_GAP - 100)) + 50;
    return { x: GAME_WIDTH, gapPosition };
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'j') jump();
    };
    const handleClick = () => jump();

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('click', handleClick);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('click', handleClick);
    };
  }, []);

  const jump = () => {
    if (!started) setStarted(true);
    setVelocity(JUMP);
  };

  useEffect(() => {
    if (!started || gameOver) return;

    const interval = setInterval(() => {
      setBirdY((y) => y + velocity);
      setVelocity((v) => v + GRAVITY);

      setPipes((prev) => {
        const newPipes = prev.map((pipe) => ({ ...pipe, x: pipe.x - 5 })).filter((pipe) => pipe.x + PIPE_WIDTH > 0);
        if (newPipes.length === 0 || newPipes[newPipes.length - 1].x < GAME_WIDTH - 250) {
          newPipes.push(generatePipe());
        }
        return newPipes;
      });

      pipes.forEach((pipe) => {
        const birdTop = birdY;
        const birdBottom = birdY + BIRD_SIZE;

        if (
          50 < pipe.x + PIPE_WIDTH && 50 + BIRD_SIZE > pipe.x &&
          (birdTop < pipe.gapPosition || birdBottom > pipe.gapPosition + PIPE_GAP)
        ) {
          setGameOver(true);
          clearInterval(interval);
        }

        if (pipe.x + PIPE_WIDTH === 50) {
          setScore((s) => s + 1);
        }
      });

      if (birdY <= 0 || birdY + BIRD_SIZE >= GAME_HEIGHT) {
        setGameOver(true);
        clearInterval(interval);
      }
    }, 30);

    return () => clearInterval(interval);
  }, [birdY, velocity, pipes, started, gameOver]);

  const resetGame = () => {
    setBirdY(GAME_HEIGHT / 2);
    setVelocity(0);
    setPipes([]);
    setScore(0);
    setGameOver(false);
    setStarted(false);
  };

  return (
    <motion.div className="window mx-auto my-4 w-full max-w-[400px] h-auto overflow-hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
      <div className="title-bar" style={{ background: 'linear-gradient(90deg, #ff69b4, #ff1493)' }}>
        <div className="title-bar-text">Flappy Bird Clone</div>
      </div>
      <div className="window-body relative overflow-hidden flex justify-center items-center h-full" style={{ width: '100%', aspectRatio: '2/3' }}>
        {gameOver && <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-700 bg-opacity-70 text-center z-10"><div className="text-4xl text-red-600">GAME OVER</div><button className="button mt-4" onClick={resetGame}>Try Again</button></div>}
        {!started && <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-700 bg-opacity-70 text-center z-10"><div className="text-2xl text-white mb-4">Press 'J' or Tap to Jump</div><button className="button" onClick={jump}>Start Game</button></div>}
        <div className="absolute z-20" style={{ top: `${birdY}px`, left: '50px', width: `${BIRD_SIZE}px`, height: `${BIRD_SIZE}px` }}>
          <Image src="/gifs/boy9.gif" alt="bird" width={BIRD_SIZE} height={BIRD_SIZE} className="object-cover" />
        </div>
        {pipes.map((pipe, index) => (
          <React.Fragment key={index}>
            <div className="absolute bg-green-600 z-0" style={{ left: `${pipe.x}px`, top: '0', width: `${PIPE_WIDTH}px`, height: `${pipe.gapPosition}px` }} />
            <div className="absolute bg-green-600 z-0" style={{ left: `${pipe.x}px`, top: `${pipe.gapPosition + PIPE_GAP}px`, width: `${PIPE_WIDTH}px`, height: `${GAME_HEIGHT - pipe.gapPosition - PIPE_GAP}px` }} />
          </React.Fragment>
        ))}
        <div className="absolute top-2 right-2 bg-gray-800 text-white px-2 py-1 rounded z-10">Score: {score}</div>
      </div>
    </motion.div>
  );
};

export default FlappyBird;
