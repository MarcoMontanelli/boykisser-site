'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import '98.css';
import { motion, AnimatePresence } from 'framer-motion';
import { FaInfoCircle, FaImage, FaHistory, FaStar, FaCog } from 'react-icons/fa';
import { Press_Start_2P } from 'next/font/google';

const pixelFont = Press_Start_2P({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-pixel',
});

const tabs = [
  { title: 'Origin', icon: <FaHistory />, content: 'The "Boykisser" meme originated from a GIF by Twitter artist Mauzymice in 2022.' },
  { title: 'Spread', icon: <FaStar />, content: 'The meme spread through Discord servers and subreddits like /r/furry_irl and /r/196 in 2023.' },
  { title: 'Variations', icon: <FaImage />, content: 'Variants include "girlkisser" versions and other creative edits across online communities.' },
  { title: 'Cultural Impact', icon: <FaCog />, content: 'The meme resonates within LGBTQ+ communities as a playful expression of affection for men.' },
  { title: 'Legacy', icon: <FaStar />, content: 'The meme remains iconic in internet culture for its humor and identity expression.' }
];

const AboutSection = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [showFaq, setShowFaq] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const images = ['/original.gif', '/original2.gif', '/original3.gif', '/original4.gif'];

  useEffect(() => {
    const interval = setInterval(() => setCarouselIndex((prev) => (prev + 1) % images.length), 5000);
    return () => clearInterval(interval);
  }, [images.length]);

  const faqs = [
    { question: 'What is Boykisser?', answer: 'A playful meme featuring a cat character teasing others about liking boys.' },
    { question: 'Who created it?', answer: 'The original GIF was made by Twitter artist Mauzymice in 2022.' },
    { question: 'Why is it popular?', answer: 'Its catchy tone, humorous appeal, and adaptability made it popular across communities.' }
  ];

  return (
    <motion.div className={`window w-full md:max-w-7xl mx-auto my-8 p-4 ${pixelFont.variable}`} initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>

      {/* Small Title Bar */}
      <div className="title-bar h-8" style={{ background: 'linear-gradient(90deg, #ff69b4, #ff1493)' }}>
        <div className="title-bar-text flex items-center gap-2 text-sm">
          <FaInfoCircle /> About Boykisser Meme
        </div>
      </div>
      <marquee className="font-pixel text-md bg-white border-2 border-gray-400 p-2 mb-4" behavior="scroll" direction="left">
        🖥️ Welcome to the Boykisser Meme Archive! Enjoy the nostalgia and memes! 🖥️
      </marquee>

      {/* Title Text Image Below Title Bar */}
      <Image src="/boys.png" alt="About Title" width={400} height={50} className="mx-auto my-2 object-contain" />

      <div className="window-body p-4 flex flex-col gap-6 items-center">

        <div className="window p-4 sunken-border w-full md:w-3/4">
          <div className="title-bar  mb-2" style={{ background: 'linear-gradient(90deg, #ff69b4, #ff1493)' }}>
            <div className="title-bar-text text-sm">Boykisser Meme Viewer</div>
          </div>
          <motion.div whileHover={{ filter: 'contrast(1.2) brightness(1.2)' }} transition={{ duration: 0.3 }}>
            <svg viewBox="0 0 1920 1080" className="w-full h-auto">
              <defs dangerouslySetInnerHTML={{
                __html: `
    <style>
      .st0 { stroke-width: 10px; }
      .st0, .st1 { fill: #fff; }
      .st0, .st2, .st3, .st4 { stroke-miterlimit: 10; }
      .st0, .st2, .st4 { stroke: #000; }
      .st5 { fill: blue; }
      .st2 { stroke-width: 8px; }
      .st2, .st3, .st4 { fill: none; }
      .st6 { fill: #4d9046; }
      .st3 { stroke: #fff; stroke-width: 12px; }
      .st7 { fill: #848584; }
      .st8 { fill: #dfdfdf; }
      .st9 { fill: #c6c6c6; }
      .st10 { fill: #0a0a0a; }
      .st11 { fill: #fefefe; }
      .st4 { stroke-width: 9px; }
      .st12 { fill: #07ff00; }
    </style>
  `}} />
              <g id="Stand">
                <line class="st2" x1="1158" y1="966" x2="1158" y2="1012" />
                <line class="st3" x1="740" y1="966" x2="740" y2="1012" />
                <rect class="st7" x="746" y="968" width="408" height="48" />
                <rect class="st7" x="696" y="912" width="511" height="49" />
                <rect class="st9" x="756" y="981" width="389" height="23" />
                <rect class="st9" x="704" y="925" width="491" height="26" />
                <rect class="st9" x="577" y="1025" width="755" height="11" />
                <line class="st0" x1="685" y1="966" x2="1214" y2="966" />
                <polygon class="st1" points="685 971 685 912 696 912 696 961 685 971" />
                <line class="st4" x1="1210" y1="966" x2="1210" y2="911" />
                <rect class="st7" x="557" y="1004" width="787" height="34" />
                <line class="st2" x1="1348" y1="1042" x2="1348" y2="1004" />
                <rect class="st1" x="568" y="1014" width="765" height="22" />
                <rect class="st9" x="577" y="1024" width="756" height="12" />
                <line class="st2" x1="557" y1="1040" x2="1352" y2="1040" />
              </g>
              <g id="Frame">
                <rect class="st10" x="421" y="64" width="1068" height="851" />
                <polyline class="st7" points="1479 62 1479 904 420 904" />
                <polyline class="st1" points="420 904 420 62 1479 62" />
                <rect class="st9" x="449" y="85" width="1001" height="796" />
                <rect class="st12" x="1337" y="853" width="56" height="10" />
                <rect class="st6" x="1337" y="843" width="56" height="10" />
                <polyline class="st11" points="1392.5 150.5 1392.5 818.5 507.5 818.5" />
                <polyline class="st7" points="507.5 818.5 507.5 150.5 1392.5 150.5" />
              </g>
              <g id="Screen">
                {/* Image inside the Screen group */}
                <foreignObject x="540" y="180" width="825" height="615">
                  <Image src={images[carouselIndex]} alt="Boykisser Meme" layout="responsive" width={600} height={600} className="object-cover aspect-square" />
                </foreignObject>
              </g>
            </svg>
          </motion.div>
        </div>

        {/* Smaller Images Panel with Sunken Effect */}
        <div className="window p-2 sunken-border flex flex-wrap justify-center gap-4">
          {images.map((img, idx) => (
            <motion.div key={idx} whileHover={{ rotate: 5, scale: 1.05 }} transition={{ duration: 0.3 }} className="border-2 border-gray-500 p-1">
              <Image src={img} alt={`Meme ${idx + 1}`} width={150} height={150} className="object-cover aspect-square" />
            </motion.div>
          ))}
        </div>

        {/* Tabs Section */}
        <div className="window p-2 sunken-border w-full">
          <menu role="tablist" className="flex flex-wrap gap-2 pt-2 px-2" style={{ background: 'linear-gradient(90deg, #ff69b4, #ff1493)' }}>
            {tabs.map((tab, index) => (
              <motion.li
                key={index}
                role="tab"
                aria-selected={activeTab === index}
                className={`button ${activeTab === index ? 'selected' : ''} px-4 py-2 flex items-center gap-2`}
                style={{ minWidth: '100px', backgroundColor: activeTab === index ? '#c0c0c0' : '#e0e0e0' }}
                onClick={() => setActiveTab(index)}
                whileHover={{ scale: 1.1 }}
              >
                {tab.icon} {tab.title}
              </motion.li>
            ))}
          </menu>

          {/* Tab Content */}
          <div className="group-box p-4 mt-2 border-2 border-gray-500">
            <AnimatePresence mode="wait">
              <motion.div key={activeTab} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.5 }}>
                <p className="font-pixel text-center">{tabs[activeTab].content}</p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <fieldset className="group-box border-2 border-gray-700 p-4 w-full mt-1">
          <legend className="text-sm font-pixel  px-2">Actions</legend>
          <div className="flex gap-2 justify-center">
            <motion.button onClick={() => window.location.href = 'https://knowyourmeme.com/memes/oooooo-you-like-boys-ur-a-boykisser'} className="button px-4 py-2 hover:scale-105 transition-transform">Discover More</motion.button>
            <motion.button onClick={() => window.location.href = 'https://www.reddit.com/r/Boykisser3/'} className="button px-4 py-2 hover:scale-105 transition-transform">Join the Fun</motion.button>
            <motion.button onClick={() => setShowFaq(true)} className="button px-4 py-2 hover:scale-105 transition-transform">FAQ</motion.button>
          </div>
        </fieldset>

      </div>

      {/* FAQ Modal */}
      <AnimatePresence>
        {showFaq && (
          <motion.div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="window p-4 w-full max-w-2xl mx-auto">
              <div className="title-bar" style={{ background: 'linear-gradient(90deg, #ff69b4, #ff1493)' }}>
                <div className="title-bar-text">Frequently Asked Questions</div>
                <div className="title-bar-controls">
                  <button aria-label="Close" onClick={() => setShowFaq(false)}></button>
                </div>
              </div>
              <div className="window-body border-2 border-gray-400 p-2 fixed-3d">
                {faqs.map((faq, index) => (
                  <div key={index} className="mb-2 border border-gray-300 p-2 group-box">
                    <button className="button w-full text-left" onClick={() => setOpenFaq(openFaq === index ? null : index)}>{faq.question}</button>
                    <AnimatePresence>
                      {openFaq === index && (
                        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }} className="overflow-hidden p-2 mt-2 bg-white border-l-4 border-pink-500 rounded">
                          {faq.answer}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Status Bar */}
      <div className="status-bar flex justify-between items-center px-4 py-1 mt-2 border-t-2 border-gray-600 bg-gray-200">
        <span className="status-bar-field font-pixel">Boykisser.exe is running...</span>
        <span className="status-bar-field font-pixel">Ready</span>
      </div>
    </motion.div>
  );
};

export default AboutSection;
