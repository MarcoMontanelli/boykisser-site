'use client';

import React, { useState } from "react";
import Image from "next/image";
import '98.css';
import { motion } from 'framer-motion';

const Navbar = () => {
  const [showLinks, setShowLinks] = useState(false);

  const buttonRoutes = [
    '/', '/linktree', '/games', '/credits', '/media'
  ];

  return (
    <motion.div
      className="window w-full mb-4 fixed top-0 left-0 right-0 z-50" // Use fixed positioning instead of sticky
      initial={{ x: '100%', opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* Title Bar */}
      <div className="title-bar" style={{ background: 'linear-gradient(90deg, #ff69b4, #ff1493)' }}>
        <div className="title-bar-text flex items-center">
          <Image src="/original3.gif" alt="logo" width={20} height={20} className="mr-2" />
          Boykisser Meme Site
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="window-body">
        <div className="hidden md:flex flex-row flex-wrap gap-2 items-center justify-center">
          {buttonRoutes.map((route, index) => (
            <button
              key={index}
              className="button flex items-center gap-2 hover:scale-105 transition-transform w-40 px-4 py-2"
              onClick={() => window.location.href = route}
            >
              <div className="w-10 h-10 bg-white border border-gray-600">
                <Image
                  src={`/gifs/boy${index + 1}.webp`}
                  alt={`Button ${index + 1}`}
                  width={40}
                  height={40}
                  className="aspect-square object-cover"
                />
              </div>
              <span className="flex-1 text-center ml-2">{route.replace('/', '') || 'Home'}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Toggle Button Only on Mobile */}
      <div className="md:hidden">
        <button
          className="button w-full text-center hover:scale-105 transition-transform"
          onClick={() => setShowLinks((prev) => !prev)}
        >
          {showLinks ? 'Hide Links' : 'Show Links'}
        </button>
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: showLinks ? 'auto' : 0, opacity: showLinks ? 1 : 0 }}
          transition={{ duration: 0.5 }}
          className="overflow-hidden"
        >
          <div className="window-body flex flex-col gap-2">
            {buttonRoutes.map((route, index) => (
              <button
                key={index}
                className="button flex items-center gap-2 hover:scale-105 transition-transform w-full px-4 py-2"
                onClick={() => window.location.href = route}
              >
                <div className="w-10 h-10 bg-white border border-gray-600">
                  <Image
                    src={`/gifs/boy${index + 1}.webp`}
                    alt={`Button ${index + 1}`}
                    width={40}
                    height={40}
                    className="aspect-square object-cover"
                  />
                </div>
                <span className="flex-1 text-center ml-2">{route.replace('/', '') || 'Home'}</span>
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Navbar;
