'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import '98.css';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTwitter, FaInstagram, FaDiscord, FaReddit, FaYoutube, FaTiktok } from 'react-icons/fa';


const Footer = () => {
    const [showMenu, setShowMenu] = useState(false);
    const [time, setTime] = useState('');

    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date();
            setTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <motion.div
            className="window w-full fixed bottom-0 left-0 right-0 z-50 h-10"
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ duration: 1 }}
            style={{ background: 'linear-gradient(90deg, #ff69b4, #ff1493)' }}
        >
            <div className="flex justify-between items-center p-1 h-full">
                <button className="p-0 h-full w-14 md:w-16 bg-gray-300 button" onClick={() => setShowMenu(!showMenu)}>
                    <Image src="/start.png" alt="Start" width={56} height={20} className="object-contain w-full h-full " />
                </button>
                <div className="flex items-center gap-4">
                    <a href="https://zyrofoxx.com" target="_blank" rel="noopener noreferrer">
                        <Image src="/icon.png" alt="Site Icon" width={20} height={20} className="object-contain" />
                    </a>
                    <span className="text-sm text-gray-300">{time}</span>
                </div>
            </div>

            <AnimatePresence>
        {showMenu && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.4 }}
            className="absolute bottom-10 left-0 bg-gray-300 border border-gray-700 w-auto md:w-auto window z-50 flex"
          >
            <Image
              src="/windows95.PNG"
              alt="Windows95"
              width={20}
              height={200}
              className="w-6 h-90 object-cover"
            />
            <div className="window-body flex flex-col gap-2 p-2 text-xs md:text-sm">
              
              <a href="https://www.instagram.com/zyro_fox24/" target="_blank" rel="noopener noreferrer" className="button flex items-center gap-2">
                <FaInstagram /> Instagram
              </a>
              <a href="https://discord.gg/kV4TEmqHUg" target="_blank" rel="noopener noreferrer" className="button flex items-center gap-2">
                <FaDiscord /> Discord
              </a>
              <a href="https://www.reddit.com/user/madonna-aramiaca/" target="_blank" rel="noopener noreferrer" className="button flex items-center gap-2">
                <FaReddit /> Reddit
              </a>
              <a href="https://www.youtube.com/@ZyroFox24/videos" target="_blank" rel="noopener noreferrer" className="button flex items-center gap-2">
                <FaYoutube /> YouTube
              </a>
              <a href="https://www.tiktok.com/@zyro_fox24" target="_blank" rel="noopener noreferrer" className="button flex items-center gap-2">
                <FaTiktok /> TikTok
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
        </motion.div>
    );
};

export default Footer;
