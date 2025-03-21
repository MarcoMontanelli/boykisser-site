'use client';

import React from 'react';
import Image from 'next/image';
import '98.css';
import { motion } from 'framer-motion';
import { FaImage, FaGamepad, FaGlobe } from 'react-icons/fa';
import { Press_Start_2P } from 'next/font/google';

// Pixelated font
const pixelFont = Press_Start_2P({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-pixel',
});

const QuickLinks = () => {
  const links = [
    {
      img: '/gifs/boy7.webp',
      title: 'Gallery',
      desc: 'Explore a collection of Boykisser memes and fan art.',
      url: '/gallery',
      icon: <FaImage />,
      titleImg: '/gallery.png'
    },
    {
      img: '/gifs/boy9.webp',
      title: 'Games',
      desc: 'Play some simple games I made in 30 minutes to pass your time.',
      url: '/games',
      icon: <FaGamepad />,
      titleImg: '/Games.png'
    },
    {
      img: '/gifs/boy6.webp',
      title: 'Join Us',
      desc: 'Browse a complete list of social media links.',
      url: '/linktree',
      icon: <FaGlobe />,
      titleImg: '/socials.png'
    }
  ];

  return (
    <motion.div className={`window mx-auto my-8 w-full md:max-w-7xl p-4 ${pixelFont.variable}`} initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
      <div className="title-bar" style={{ background: 'linear-gradient(90deg, #ff69b4, #ff1493)' }}>
        <div className="title-bar-text text-xl font-bold">Quick Links</div>
      </div>
      <div className="window-body grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch">
        {links.map((link, index) => (
          <motion.div
            key={index}
            className="flex flex-col items-center gap-4 justify-between border-2 border-gray-300 p-4 fixed-3d h-full bg-gradient-to-br from-gray-200 to-gray-300"
            whileHover={{ scale: 1.05, boxShadow: '0 0 20px 5px #ff69b4' }}
            transition={{ duration: 0.3 }}
          >
            <div className="title-bar w-full" style={{ background: 'linear-gradient(90deg, #ff69b4, #ff1493)' }}>
              <div className="title-bar-text flex items-center gap-2 text-white">
                {link.icon} {link.title}
              </div>
            </div>
            <Image src={link.img} alt={link.title} width={150} height={150} className="border-2 border-gray-500 w-full aspect-square object-cover" />
            <Image src={link.titleImg} alt={`${link.title} Title`} width={200} height={50} className="object-contain mb-2" />
            <p className="font-pixel text-sm text-center">{link.desc}</p>
            <button
              onClick={() => window.location.href = link.url}
              className="button px-4 py-2 mx-auto hover:scale-105 transition-transform"
            >
              Go
            </button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default QuickLinks;
