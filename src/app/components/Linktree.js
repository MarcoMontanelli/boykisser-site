'use client';
import React, { useState, useEffect } from 'react';
import '98.css';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { FaMusic, FaPalette, FaGamepad, FaUsers } from 'react-icons/fa';

const tabs = [
  {
    title: '🎵 Music',
    color: 'bg-pink-500',
    image: '/back6.gif',
    links: [
      { icon: <FaMusic />, label: 'Studi01', url: 'https://www.youtube.com/watch?v=Ie57fr8pCko&pp=ygUOYm95a2lzc2VyIHNvbmc%3D' },
      { icon: <FaMusic />, label: 'dewperland', url: 'https://www.youtube.com/watch?v=XPuByyASa_M' },
      { icon: <FaMusic />, label: 'Uhh', url: 'https://www.youtube.com/watch?v=Q5-bhcPRlg8' },
    ],
  },
  {
    title: '🎨 Art',
    color: 'bg-blue-500',
    image: '/back13gif.gif',
    links: [
      { icon: <FaPalette />, label: 'Place', url: 'https://pixelplace.io/93437-in-memory-of-r-boykisser' },
      { icon: <FaPalette />, label: 'DeviantArt', url: 'https://www.deviantart.com/search?q=boykisser' },
      { icon: <FaPalette />, label: 'FurAffinity', url: 'https://www.furaffinity.net/search/?q=boykisser' },
    ],
  },
  {
    title: '🕹️ Games',
    color: 'bg-green-500',
    image: '/back15.png',
    links: [
      { icon: <FaGamepad />, label: 'Quiz', url: 'https://boykisser.zyrofoxx.com' },
      { icon: <FaGamepad />, label: 'Itch.io', url: 'https://itch.io/games/tag-boykisser' },
      { icon: <FaGamepad />, label: 'Escape the boykisser', url: 'https://store.steampowered.com/app/2708280/ESCAPE_FROM_BOYKISSER/' },
    ],
  },
  {
    title: '🧑‍🤝‍🧑 Social',
    color: 'bg-purple-500',
    image: '/back14.png',
    links: [
      { icon: <FaUsers />, label: 'Reddit memes', url: 'https://www.reddit.com/r/boykissermemes/' },
      { icon: <FaUsers />, label: 'Boykisser discord', url: 'https://discord.com/invite/78jWNpdfsz' },
      { icon: <FaUsers />, label: 'Reddit', url: 'https://www.reddit.com/r/Boykisser3/' },
    ],
  },
];

export default function LinktreeWindow() {
  const [activeTab, setActiveTab] = useState(0);
  const [showOverlay, setShowOverlay] = useState(false);
  const [statusText, setStatusText] = useState('Loading...');

  useEffect(() => {
    setShowOverlay(true);
    setStatusText('Loading...');
    const timer = setTimeout(() => {
      setShowOverlay(false);
      setStatusText('Ready');
    }, 3000);
    return () => clearTimeout(timer);
  }, [activeTab]);

  return (
    <div className="min-h-screen w-full flex justify-center items-start sm:items-center p-4  overflow-y-auto">

      <motion.div
        className="window w-full max-w-5xl mx-auto"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="title-bar" style={{ background: 'linear-gradient(90deg, #ff69b4, #ff1493)' }}>
          <div className="title-bar-text text-xl font-bold">The boykisser Linktree</div>
        </div>

        <div className="window-body p-4 flex flex-col md:flex-row gap-4">
          {/* Left Column - CRT Monitor Filling Area */}
          <div className="md:w-1/3 flex items-center justify-center">
            <div className="w-full h-full">
              <svg viewBox="0 0 1069 984.7" className="w-full h-full object-contain">
                <defs dangerouslySetInnerHTML={{
                  __html: `
          <style>
            .st0 { fill: #fff; }
            .st1 { fill: blue; }
            .st2 { stroke-width: 8px; }
            .st2, .st3, .st4, .st5 { fill: none; stroke-miterlimit: 10; }
            .st2, .st4, .st5 { stroke: #000; }
            .st6 { fill: #4d9046; }
            .st3 { stroke: #fff; stroke-width: 12px; }
            .st7 { fill: #848584; }
            .st8 { fill: #dfdfdf; }
            .st4 { stroke-width: 10px; }
            .st9 { fill: #c6c6c6; }
            .st10 { fill: #0a0a0a; }
            .st11 { fill: #fefefe; }
            .st5 { stroke-width: 9px; }
            .st12 { fill: #07ff00; }
          </style>
        `}}
                />

                {/* Monitor Stand */}
                <g id="Stand">
                  <line class="st2" x1="738" y1="904" x2="738" y2="950" />
                  <line class="st3" x1="320" y1="904" x2="320" y2="950" />
                  <rect class="st7" x="326" y="906" width="408" height="48" />
                  <rect class="st7" x="276" y="850" width="511" height="49" />
                  <rect class="st9" x="336" y="919" width="389" height="23" />
                  <rect class="st9" x="284" y="863" width="491" height="26" />
                  <rect class="st9" x="157" y="963" width="755" height="11" />
                  <line class="st4" x1="265" y1="904" x2="794" y2="904" />
                  <polygon class="st0" points="265 909 265 850 276 850 276 899 265 909" />
                  <line class="st5" x1="790" y1="904" x2="790" y2="849" />
                  <rect class="st7" x="137" y="942" width="787" height="34" />
                  <line class="st2" x1="928" y1="980" x2="928" y2="942" />
                  <rect class="st0" x="148" y="952" width="765" height="22" />
                  <rect class="st9" x="157" y="962" width="756" height="12" />
                  <line class="st2" x1="137" y1="978" x2="932" y2="978" />
                </g>

                {/* Monitor Frame */}
                <g id="Frame">
                  <rect class="st10" x="1" y="2" width="1068" height="851" />
                  <polyline class="st7" points="1059 0 1059 842 0 842" />
                  <polyline class="st0" points="0 842 0 0 1059 0" />
                  <rect class="st9" x="29" y="23" width="1001" height="796" />
                  <rect class="st12" x="917" y="791" width="56" height="10" />
                  <rect class="st6" x="917" y="781" width="56" height="10" />
                  <polyline class="st11" points="972.5 88.5 972.5 756.5 87.5 756.5" />
                  <polyline class="st7" points="87.5 756.5 87.5 88.5 972.5 88.5" />
                </g>

                {/* Screen Area with Title Bar and GIF Display */}
                <g id="Screen">
                  <foreignObject x="119" y="110" width="826" height="622">
                    <div className="window h-full w-full flex flex-col">

                      {/* GIF Display */}
                      <div className="window-body h-full w-full flex items-center justify-center">
                        <AnimatePresence mode="wait">
                          <motion.div
                            key={activeTab}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.6 }}
                            className="w-full h-full"
                          >
                            <Image
                              src={tabs[activeTab].image}
                              alt={tabs[activeTab].title}
                              layout="fill"
                              objectFit="cover"
                              className="w-full h-full"
                            />
                          </motion.div>
                        </AnimatePresence>
                      </div>
                    </div>
                  </foreignObject>
                </g>
              </svg>
            </div>
          </div>


          {/* Right Column - Tabs and Links */}
          <div className="md:w-2/3 flex flex-col gap-4">
            {/* Title Image */}
            <Image src="/link2.png" alt="Title" width={300} height={50} className="mb-1 self-center object-contain" />
            <p className="text-center font-pixel text-sm mb-1">
              Welcome to the boykisser Linktree! Explore music, art, games, and social links related to this meme in a retro Windows 95 style!
            </p>

            {/* Tabs Section */}
            {/* Tabs Section - No gap between tabs and content */}
            <menu role="tablist" className="flex gap-0 border-b-0">
              {tabs.map((tab, index) => (
                <li
                  key={index}
                  role="tab"
                  aria-selected={activeTab === index}
                  className={`button ${tab.color} ${activeTab === index ? 'selected' : ''} px-4 py-2 text-white rounded-none`}
                  onClick={() => setActiveTab(index)}
                >
                  {tab.title}
                </li>
              ))}
            </menu>

            {/* Tab Content directly below Tabs */}
            <div className="window mt-0 border-t-0">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex flex-col gap-4">
                    {tabs[activeTab].links.map((link, i) => (
                      <motion.a
                        key={i}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="button w-full flex items-center gap-3 p-2"
                      >
                        <div className="text-xl">{link.icon}</div>
                        <span className="flex-grow text-left">{link.label}</span>
                      </motion.a>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {showOverlay && (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.8 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}  // Fade in/out in 0.5s each
              className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70 text-white text-4xl font-pixel z-50"
            >
              {tabs[activeTab].title}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Status Bar */}
        <div className="status-bar mt-2">
          <div className="status-bar-field">{statusText}</div>
          <div className="status-bar-field"> 2025 ZyroFox</div>
          <div className="status-bar-field">Powered by nostalgia</div>
        </div>
      </motion.div>
    </div>
  );
}
