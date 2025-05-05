'use client';

import React from 'react';
import Image from 'next/image';
import '98.css';
import { motion } from 'framer-motion';
import { FaHeart, FaTools, FaCode, FaPaintBrush, FaCubes, FaWolfPackBattalion } from 'react-icons/fa';
import { Press_Start_2P } from 'next/font/google';

// Pixelated font
const pixelFont = Press_Start_2P({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-pixel',
});

const Tooltip = ({ text }) => (
  <motion.div
    className="absolute bg-gray-200 border-2 border-gray-600 p-2 text-xs font-pixel shadow-md z-50"
    initial={{ opacity: 0, y: 5 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 5 }}
    transition={{ duration: 0.3 }}
  >
    {text}
  </motion.div>
);

const AboutCreator = () => {
  return (
    <motion.div 
      className={`window mx-auto my-8 w-full md:max-w-7xl p-4 bg-[url('/images/pixel-pattern.png')] bg-repeat ${pixelFont.variable}`}
      initial={{ opacity: 0, y: 50 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 1 }}
    >
      <div className="title-bar" style={{ background: 'linear-gradient(90deg, #ff69b4, #ff1493)' }}>
        <div className="title-bar-text text-xl font-bold">About the Creator</div>
      </div>

      <div className="window-body grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch font-pixel">
        
        {/* Left Column - About ZyroFox */}
        <div className="flex flex-col gap-4 text-center md:text-left justify-between window p-4 sunken-border h-full relative">
          <div className="title-bar" style={{ background: 'linear-gradient(90deg, #ff69b4, #ff1493)' }}>
            <div className="title-bar-text flex items-center gap-2 text-white">
              <FaWolfPackBattalion /> About ZyroFox
            </div>
          </div>
          <div className="p-2" >
          <Image src="/icon.png" alt="Creator" width={200} height={200} className=" mx-auto object-cover aspect-square" />
          <Image src="/zyroT.png" alt="About Title" width={200} height={50} className="mx-auto object-contain mb-4" />

          <p className="text-base text-center md:text-left">
            Hi, I'm Zyro! A passionate web developer and meme enthusiast behind the Boykisser meme site. I love blending nostalgia with modern web design to create fun and engaging experiences.
          </p>
          <p className="text-sm text-center md:text-left">
            From late-night coding sessions to curating the best memes, I aim to bring smiles to everyone who visits my site.
          </p>
          <button onClick={() => window.location.href = 'https://zyrofoxx.com'} 
            className="button hover:bg-pink-500 hover:text-white transition-all hover:shadow-pink-500/50 my-2 hover:scale-105 w-full py-3 mx-auto">
            Learn More
          </button>

          {/* Quick Stats */}
          <div className="group-box p-3 border-dashed border-2 border-gray-500" s>
            <div className="title-bar" style={{ background: 'linear-gradient(90deg, #9b59b6, #8e44ad)' }}>
              <div className="title-bar-text text-white">Quick Stats</div>
            </div>
            <ul className="text-sm list-none space-y-1 mt-2">
              <li>📦 Experience: 5yrs</li>
              <li>🧃 Monster cans consumed: 500+</li>
              <li>❤️ Favorite Meme: Boykisser</li>
            </ul>
          </div>
          </div>
          
        </div>

        {/* Right Column - Support ZyroFox */}
        <div className="flex flex-col items-center gap-4 window p-4 sunken-border h-full relative">
          <div className="title-bar w-full" style={{ background: 'linear-gradient(90deg, #ff69b4, #ff1493)' }}>
            <div className="title-bar-text flex items-center gap-2 text-white">
              <FaHeart /> Support ZyroFox
            </div>
          </div>
          <div className="p-1" >
          <Image src="/supportT.png" alt="Support Title" width={200} height={50} className="mx-auto object-contain mb-4" />
          <p className="text-sm text-center w-full">Enjoying the site? Consider buying me a monster!</p>
          <div className="w-full flex justify-center items-center">
            <Image src="/monster.gif" alt="Buy Me a Coffee" width={140} height={140} className="object-contain w-auto h-auto" />
          </div>
          <button onClick={() => window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ', '_blank')} 
            className="button hover:bg-pink-500 hover:text-white transition-all hover:shadow-pink-500/50 hover:scale-105 w-full py-3">
            Buy Me a Monster
          </button>

          {/* Tools I Use */}
          <div className="group-box p-3 border-dashed border-2 border-gray-500 w-full" >
            <div className="title-bar" style={{ background: 'linear-gradient(90deg, #9b59b6, #8e44ad)' }}>
              <div className="title-bar-text text-white">Tools I Use</div>
            </div>
            <div className="flex flex-wrap gap-4 items-center justify-center w-full mt-2">
              <div className="relative group">
                <FaCode className="text-blue-600 text-2xl hover:animate-bounce" />
                <div className="invisible group-hover:visible">
                  <Tooltip text="VS Code" />
                </div>
              </div>
              <div className="relative group">
                <FaPaintBrush className="text-purple-600 text-2xl hover:animate-bounce" />
                <div className="invisible group-hover:visible">
                  <Tooltip text="Photoshop" />
                </div>
              </div>
              <div className="relative group">
                <FaCubes className="text-blue-500 text-2xl hover:animate-bounce" />
                <div className="invisible group-hover:visible">
                  <Tooltip text="React" />
                </div>
              </div>
              <div className="relative group">
                <FaTools className="text-black text-2xl hover:animate-bounce" />
                <div className="invisible group-hover:visible">
                  <Tooltip text="Next.js" />
                </div>
              </div>
            </div>
          </div>

          {/* Scrolling Marquee with Image */}
          <marquee className="font-mono text-sm bg-white p-2 border-2 border-gray-400 mt-4 flex items-center gap-2" behavior="scroll" direction="left">
            <Image src="/original2.gif" alt="Smile" width={20} height={20} className="object-contain" /> 
            Thank you for your support! You're awesome!
          </marquee>
          </div>

        </div>
      </div>

      {/* Animated Divider */}
      <div className="h-1 bg-gradient-to-r from-pink-400 via-gray-400 to-pink-400 animate-pulse mt-4"></div>
    </motion.div>
  );
};

export default AboutCreator;
