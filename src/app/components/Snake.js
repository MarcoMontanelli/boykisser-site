'use client';

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import '98.css';
import { motion } from 'framer-motion';

const GRID_SIZE = 15;

const SnakeGame = () => {
  const [snake, setSnake] = useState([{ x: 7, y: 7 }]);
  const [apple, setApple] = useState({ x: 5, y: 5 });
  const [direction, setDirection] = useState('RIGHT');
  const [gameOver, setGameOver] = useState(false);
  const [win, setWin] = useState(false);
  const [started, setStarted] = useState(false);

  const getRandomPosition = () => ({
    x: Math.floor(Math.random() * GRID_SIZE),
    y: Math.floor(Math.random() * GRID_SIZE),
  });

  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'w':
          if (direction !== 'DOWN') setDirection('UP');
          break;
        case 'a':
          if (direction !== 'RIGHT') setDirection('LEFT');
          break;
        case 's':
          if (direction !== 'UP') setDirection('DOWN');
          break;
        case 'd':
          if (direction !== 'LEFT') setDirection('RIGHT');
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  const moveSnake = useCallback(() => {
    if (!started || gameOver || win) return;

    const newSnake = [...snake];
    const head = { ...newSnake[0] };

    switch (direction) {
      case 'UP':
        head.y -= 1;
        break;
      case 'DOWN':
        head.y += 1;
        break;
      case 'LEFT':
        head.x -= 1;
        break;
      case 'RIGHT':
        head.x += 1;
        break;
    }

    if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
      setGameOver(true);
      return;
    }

    for (let segment of newSnake) {
      if (segment.x === head.x && segment.y === head.y) {
        setGameOver(true);
        return;
      }
    }

    newSnake.unshift(head);
    if (head.x === apple.x && head.y === apple.y) {
      setApple(getRandomPosition());
      if (newSnake.length === GRID_SIZE * GRID_SIZE) {
        setWin(true);
      }
    } else {
      newSnake.pop();
    }

    setSnake(newSnake);
  }, [snake, apple, direction, gameOver, win, started]);

  useEffect(() => {
    const interval = setInterval(moveSnake, 200);
    return () => clearInterval(interval);
  }, [moveSnake]);

  const handleButtonClick = (dir) => {
    setDirection(dir);
  };

  const resetGame = () => {
    setSnake([{ x: 7, y: 7 }]);
    setApple(getRandomPosition());
    setDirection('RIGHT');
    setGameOver(false);
    setWin(false);
    setStarted(true);
  };

  return (
    <motion.div
      className="window mx-auto my-4 w-full max-w-[400px]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <div className="title-bar" style={{ background: 'linear-gradient(90deg, #ff69b4, #ff1493)' }}>
        <div className="title-bar-text">Snake Game</div>
      </div>
      <div className="window-body relative">
        {(gameOver || win) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 flex flex-col items-center justify-center bg-gray-700 bg-opacity-70 text-center"
          >
            <div className={`font-mono text-4xl ${gameOver ? 'text-red-600' : 'text-green-600'}`}>
              {gameOver ? 'GAME OVER' : 'YOU WIN!'}
            </div>
            <button
              className="button mt-4"
              onClick={resetGame}
            >
              Try Again
            </button>
          </motion.div>
        )}
        {!started && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 flex flex-col items-center justify-center bg-gray-700 bg-opacity-70 text-center"
          >
            <button
              className="button"
              onClick={resetGame}
            >
              Start Game
            </button>
          </motion.div>
        )}
        <div
          className="grid mx-auto"
          style={{
            gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
            gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`,
            aspectRatio: '1 / 1'
          }}
        >
          {Array.from({ length: GRID_SIZE * GRID_SIZE }, (_, i) => {
            const x = i % GRID_SIZE;
            const y = Math.floor(i / GRID_SIZE);
            const isSnake = snake.some(seg => seg.x === x && seg.y === y);
            const isApple = apple.x === x && apple.y === y;

            return (
              <div
                key={i}
                className="border border-gray-500"
                style={{
                  backgroundColor: isSnake ? '#ff69b4' : isApple ? 'red' : 'white',
                  backgroundImage: isApple ? 'url(/gifs/boy9.gif)' : 'none',
                  backgroundSize: 'cover',
                }}
              />
            );
          })}
        </div>
        <div className="flex flex-col items-center mt-4 md:hidden">
          <button className="button mb-2" onClick={() => handleButtonClick('UP')}>↑</button>
          <div className="flex gap-2">
            <button className="button" onClick={() => handleButtonClick('LEFT')}>←</button>
            <button className="button" onClick={() => handleButtonClick('DOWN')}>↓</button>
            <button className="button" onClick={() => handleButtonClick('RIGHT')}>→</button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SnakeGame;
