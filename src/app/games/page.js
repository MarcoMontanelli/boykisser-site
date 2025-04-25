'use client';

import React from 'react';
import Link from 'next/link';
import '98.css';
import LabyrinthGame from '../components/Lab';

export default function Games() {
  return (
    <div className="flex items-center justify-center min-h-screen relative p-6 ">
    
      <div className="window max-w-4xl w-full shadow-lg border border-gray-500">
        
        <div
          className="title-bar"
          style={{ background: 'linear-gradient(to right, #ff69b4, #ff1493)' }}
        >
          <div className="title-bar-text font-bold text-base">🎮 Retro Game Lab</div>
          <div className="title-bar-controls">
            <button
              aria-label="Close"
              onClick={() => alert("Nope. Ur a boykisser!")}
            ></button>
          </div>
        </div>

        
        <div className="window-body bg-gray-300 text-black p-6 space-y-6">
          
          <div className="w-full max-w-5xl flex justify-center mb-2">
            <img
              src="/gamezone.png" // Replace with your actual image path
              alt="Retro Game Zone Banner"
              className="w-full max-h-48 object-contain "
            />
          </div>

          
          <div className="text-center">
            <h2 className="text-lg font-bold mb-2">💾 Welcome to the Game Zone</h2>
            <p className="text-sm">
              Explore experimental games straight from the Win95 vault.<br />
              Click a title to start your adventure!
            </p>
          </div>

          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="border-2 border-dashed border-gray-400 p-4 bg-gray-200 shadow-md flex flex-col items-center text-center">
              <img
                src="/labgame.PNG"
                alt="Boykisser Backrooms"
                className="w-full h-full object-cover mb-3 border border-gray-400"
              />
              <h3 className="font-bold text-pink-600 text-base mb-1">
                🌀 Coming Soon: Boykisser Backrooms
              </h3>
              <p className="text-xs text-gray-700 mb-2">
                A confusing journey through randomly generated chaos.
              </p>
              <button className="button text-sm" disabled>
                Coming soon!
              </button>
            </div>

            
            <div className="border-2 border-dashed border-gray-400 p-4 bg-gray-200 shadow-md flex flex-col items-center text-center">
              <img
                src="/gameQuiz.PNG"
                alt="Boykisser Quiz"
                className="w-full h-full  object-cover mb-3 border border-gray-400"
              />
              <h3 className="font-bold text-blue-600 text-base mb-1">💡 Boykisser Quiz</h3>
              <p className="text-xs text-gray-700 mb-2">
                A rapid-fire mini-quiz playground for true memelords.
              </p>
              <Link href="https://boykisser-quiz.vercel.app">
                <button className="button text-sm">Play!</button>
              </Link>
            </div>
          </div>

          
          <div className="mt-6 text-center text-xs text-gray-500 ">
            Made with 🖱️ and nostalgia — ZyroFox 2025
          </div>
        </div>
      </div>
  
    </div>
  );
}
