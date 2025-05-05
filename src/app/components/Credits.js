'use client';

import React, { useState } from 'react';
import '98.css';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FaHeart, FaCode, FaPaintBrush, FaMusic, FaUsers, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { Press_Start_2P } from 'next/font/google';

const pixelFont = Press_Start_2P({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-pixel',
});

export default function CreditsWindow() {
  const [showMore, setShowMore] = useState(false);
  const router = useRouter();

  const sections = [
    { title: 'Developers', icon: <FaCode />, items: ['Mariotim3 (boykisser.com)', 'AzzyTheFurry (improved version)', 'ZyroFox'], color: 'bg-gradient-to-r from-pink-500 to-pink-300', iconColor: 'text-pink-500' },
    { title: 'Creators', icon: <FaPaintBrush />, items: ['Mauzymice (original gif)', 'lilillillie (original post on r/196)', 'PinkDeerfox (boykisser text)', '_Moon_Runner_ '], color: 'bg-gradient-to-r from-blue-500 to-blue-300', iconColor: 'text-blue-500' },
    { title: 'Media', icon: <FaMusic />, items: ['Studi01', 'Dewperland', 'uhh (dancing video)', 'Thejoner (monitor svg and other icons)'], color: 'bg-gradient-to-r from-green-500 to-green-300', iconColor: 'text-green-500' },
    { title: 'Special Thanks', icon: <FaHeart />, items: ['The boykisser Community', 'Furry_irl', 'X and reddit'], color: 'bg-gradient-to-r from-purple-500 to-purple-300', iconColor: 'text-purple-500' },
  ];

  return (
    <div className="min-h-screen w-full flex justify-center items-start sm:items-center p-4  overflow-y-auto">

      <motion.div className={`window w-full md:max-w-3xl mx-auto ${pixelFont.variable}`} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }}>
        <div className="title-bar" style={{ background: 'linear-gradient(90deg, #ff69b4, #ff1493)' }}>
          <div className="title-bar-text text-xl font-bold">Credits</div>
        </div>

        <div className="window-body p-4 flex flex-col gap-4 font-pixel">
          <Image src="/credits.png" alt="Credits Title" width={400} height={80} className="self-center mb-4 object-contain" />
          <p className="text-center text-sm mb-4">A heartfelt thank you to everyone who made this project possible. You rock!</p>

          <div className="grid md:grid-cols-2 gap-4">
            {sections.map((section, index) => (
              <motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.2 }} className="p-4 window sunken-border shadow-md sunken">
                <h2 className={`text-lg font-bold flex items-center gap-2 mb-2 ${section.color} text-white px-2 py-1`}>
                  {section.icon} {section.title}
                </h2>
                <ul className="list-none text-sm">
                  {section.items.map((item, i) => (
                    <motion.li key={i} whileHover={{ x: 10 }} transition={{ type: 'spring', stiffness: 300 }} className="flex items-center gap-2 p-1 hover:bg-gray-200 hover:shadow-inner rounded">
                      <span className={`${section.iconColor} text-sm`}>{section.icon}</span>
                      {item}
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          <AnimatePresence>
            {showMore && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.5 }} className="p-4 window sunken-border shadow-md sunken">
                <h2 className="text-lg font-bold flex items-center gap-2 mb-2 bg-gradient-to-r from-yellow-500 to-yellow-300 text-white px-2 py-1">
                  <FaUsers /> Additional Credits
                </h2>
                <ul className="list-none text-sm">
                  <motion.li whileHover={{ x: 10 }} transition={{ type: 'spring', stiffness: 300 }} className="flex items-center gap-2 p-1 hover:bg-gray-200 hover:shadow-inner rounded">
                    <FaUsers className="text-yellow-500" /> Monster energy
                  </motion.li>
                  <motion.li whileHover={{ x: 10 }} transition={{ type: 'spring', stiffness: 300 }} className="flex items-center gap-2 p-1 hover:bg-gray-200 hover:shadow-inner rounded">
                    <FaUsers className="text-yellow-500" /> The artists who made the gifs&images | if you own any of the content in this site and you want to be credited don't hesitate to contact me
                  </motion.li>
                </ul>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex justify-between items-center mt-4">
            <button className="button px-4 py-2" onClick={() => setShowMore(!showMore)}>
               View More
            </button>
            <button className="button px-4 py-2" onClick={() => router.push('/')}>Back</button>
          </div>

          <marquee className="text-sm bg-white p-2 border-2 border-gray-400 mt-4">Built with passion, code, and caffeine. Thank you for visiting!</marquee>

          <div className="status-bar mt-2">
            <div className="status-bar-field">2025 ZyroFox</div>
            <div className="status-bar-field">Credits</div>
            <div className="status-bar-field">Built with ❤️</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
