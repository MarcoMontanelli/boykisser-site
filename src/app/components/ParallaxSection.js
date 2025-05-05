'use client';

import React, { useState, useEffect } from 'react';
import '98.css';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Press_Start_2P } from 'next/font/google';

const pixelFont = Press_Start_2P({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-pixel',
});

const images = [
  '/femboy.png',
  '/femboy.png',
  '/femboy.png'
];

const ParallaxSection = () => {
  const [current, setCurrent] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  return (
    <div className={`relative w-full h-[60vh] overflow-hidden ${pixelFont.variable}`} style={{ backgroundAttachment: 'fixed' }}>
      {images.map((src, index) => (
        <motion.div
          key={index}
          className="absolute top-0 left-0 w-full h-full bg-cover bg-center"
          style={{ backgroundImage: `url(${src})`, zIndex: index === current ? 0 : -1 }}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: index === current ? 1 : 0, scale: 1 }}
          transition={{ duration: 1 }}
        />
      ))}

      <div className="absolute inset-0 bg-black bg-opacity-60 flex flex-col items-center justify-center p-8 text-center">
        <Image src="/mainT.png" alt="Boykisser Website" width={600} height={100} className="mb-4 object-contain hover:scale-105 transition-transform" />

        <p className="text-2xl text-white mb-2 transition-transform hover:scale-105" style={{ fontFamily: 'var(--font-pixel)' }}>
          You like kissing boys don't you?
        </p>

        <p className="text-sm text-white mb-6 flex items-center gap-2" style={{ fontFamily: 'var(--font-pixel)' }}>
          Powered by <Image src="/pinkMonster.png" alt="Icon" width={32} height={32} className="scale-125" />
        </p>


        <button className="bg-gray-300 button text-lg px-6 py-3 hover:scale-110 transition-transform font-pixel" onClick={() => window.location.href = 'https://knowyourmeme.com/memes/oooooo-you-like-boys-ur-a-boykisser'}>
          Explore
        </button>
      </div>

      {/* Expand button in bottom-right corner */}
      <button
        className="absolute bottom-4 right-4 bg-gray-300 button flex justify-center items-center px-3 py-1 hover:scale-110 transition-transform z-10 font-pixel"
        onClick={openModal}
      >
        Expand
      </button>

      <AnimatePresence>
        {modalOpen && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="window p-4 w-full max-w-7xl mx-auto"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <div className="title-bar" style={{ background: 'linear-gradient(90deg, #ff69b4, #ff1493)' }}>
                <div className="title-bar-text font-pixel">Image Viewer</div>
                <div className="title-bar-controls">
                  <button aria-label="Close" onClick={closeModal}></button>
                </div>
              </div>
              <div className="window-body flex flex-col items-center">
                <Image src={images[current]} alt="fullscreen" width={800} height={600} className="object-contain w-full h-full" />
                <button className="button mt-4 font-pixel" onClick={closeModal}>Close</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ParallaxSection;
