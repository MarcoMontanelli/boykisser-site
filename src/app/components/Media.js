'use client';

import React, { useState, useEffect, useRef } from 'react';
import '98.css';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { FaImage, FaVideo, FaMusic, FaYoutube, FaShareAlt, FaDownload, FaPlay, FaPause, FaStepForward, FaStepBackward, FaRedo, FaVolumeUp, FaFolder } from 'react-icons/fa';
import { Press_Start_2P } from 'next/font/google';

const pixelFont = Press_Start_2P({
    weight: '400',
    subsets: ['latin'],
    variable: '--font-pixel',
});

const tabs = [
    { title: 'Images/GIFs', icon: <FaImage />, color: 'bg-pink-500', path: 'C:\\Media\\Images' },
    { title: 'Videos', icon: <FaVideo />, color: 'bg-blue-500', path: 'C:\\Media\\Videos' },
    { title: 'Audio', icon: <FaMusic />, color: 'bg-green-500', path: 'C:\\Media\\Audio' },
];

const mediaItems = {
    images: [
        { id: 1, src: '/gifs/boy1.webp', filename: 'boykisser1.png' },
        { id: 2, src: '/gifs/boy2.webp', filename: 'boykisser2.gif' },
    ],
    videos: [
        { id: 3, src: '/boykisser1.mp4', filename: 'boykisser_video1.mp4', thumbnail: '/boythumb1.PNG' },
    ],
    audio: [
        { id: 4, src: '/boykisserSong.mp3', filename: 'boykisser_song1.mp3', thumbnail: '/boythumb2.webp' },
    ],
};

export default function MediaExplorer() {
    const [activeTab, setActiveTab] = useState(0);
    const [selectedMedia, setSelectedMedia] = useState(null);
    const [showOverlay, setShowOverlay] = useState(false);
    const [tooltip, setTooltip] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const audioRef = useRef(null);
    const videoRef = useRef(null);
    const [volume, setVolume] = useState(50);

    const handleVolumeChange = (e) => {
        const media = audioRef.current || videoRef.current;
        if (media) {
            media.volume = e.target.value / 100;
            setVolume(e.target.value);
        }
    };

    useEffect(() => {
        setShowOverlay(true);
        const timer = setTimeout(() => setShowOverlay(false), 500);
        return () => clearTimeout(timer);
    }, [activeTab]);

    const handleCopyLink = (link) => {
        navigator.clipboard.writeText(link);
        setTooltip(true);
        setTimeout(() => setTooltip(false), 2000);
    };

    const handlePlayPause = () => {
        const media = audioRef.current || videoRef.current;
        if (media) {
            if (isPlaying) {
                media.pause();
            } else {
                media.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const handleRewind = () => {
        const media = audioRef.current || videoRef.current;
        if (media) media.currentTime = Math.max(0, media.currentTime - 5);
    };

    const handleForward = () => {
        const media = audioRef.current || videoRef.current;
        if (media) media.currentTime = Math.min(media.duration, media.currentTime + 5);
    };

    const handleRepeat = () => {
        const media = audioRef.current || videoRef.current;
        if (media) {
            media.currentTime = 0;  // Restart media
            media.play();           // Play from start
            setIsPlaying(true);     // Update state
        }
    };

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };


    const handleTimeUpdate = () => {
        const media = audioRef.current || videoRef.current;
        if (media) setProgress((media.currentTime / media.duration) * 100);
    };

    const handleSliderChange = (e) => {
        const media = audioRef.current || videoRef.current;
        if (media) {
            const newTime = (e.target.value / 100) * media.duration;
            media.currentTime = newTime;
            setProgress(e.target.value);
        }
    };

    const renderMediaItems = () => {
        let items = [];
        if (activeTab === 0) items = mediaItems.images;
        if (activeTab === 1) items = mediaItems.videos;
        if (activeTab === 2) items = mediaItems.audio;

        return (
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2 p-2">
                {items.map((item) => (
                    <motion.div
                        key={item.id}
                        whileHover={{ scale: 1.05 }}
                        className="flex flex-col items-center cursor-pointer"
                        onClick={() => setSelectedMedia(item)}
                    >
                        <Image
                            src={item.thumbnail || item.src}
                            alt={item.filename}
                            width={64}
                            height={64}
                            className="object-cover w-16 h-16 aspect-square border border-gray-400"
                        />
                        <span className="text-xs mt-1 truncate w-16 text-center">{item.filename}</span>
                    </motion.div>
                ))}
            </div>
        );
    };


    const renderMediaModal = () => {
        if (!selectedMedia) return null;

        const isVideo = selectedMedia.filename.endsWith('.mp4');
        const isAudio = selectedMedia.filename.endsWith('.mp3');

        return (
            <motion.div
                className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                <div className="window p-4 w-full max-w-7xl mx-auto">
                    <div className="title-bar" style={{ background: 'linear-gradient(90deg, #ff69b4, #ff1493)' }}>
                        <div className="title-bar-text">{selectedMedia.filename}</div>
                        <div className="title-bar-controls">
                            <button aria-label="Close" onClick={() => setSelectedMedia(null)}></button>
                        </div>
                    </div>

                    <div className="window-body flex flex-col items-center">
                        {isVideo && (
                            <video
                                ref={videoRef}
                                src={selectedMedia.src}
                                onTimeUpdate={handleTimeUpdate}
                                className="mb-2 object-contain w-full"
                            />
                        )}

                        {isAudio && (
                            <>
                                <Image
                                    src={selectedMedia.thumbnail || '/default-audio-thumbnail.png'}
                                    alt={selectedMedia.filename}
                                    layout="responsive"
                                    width={800}
                                    height={800}
                                    className="mb-2 object-contain"
                                />
                                <audio ref={audioRef} src={selectedMedia.src} onTimeUpdate={handleTimeUpdate} className="hidden" />
                            </>
                        )}

                        {!isVideo && !isAudio && (
                            <Image src={selectedMedia.src} alt={selectedMedia.filename} layout="responsive" width={800} height={800} className="mb-4 object-contain" />
                        )}

                        {(isVideo || isAudio) && (
                            <div className="flex flex-col w-full border-t-2 mt-4">
                                {/* Timeline Slider with Timestamp */}
                                <div className="flex flex-col sm:flex-row items-center justify-between p-2 border-b-2 gap-2">
                                    <input
                                        type="range"
                                        className="w-full"
                                        value={progress}
                                        onChange={handleSliderChange}
                                    />
                                    <div className="text-xs text-red-600 mx-2 text-center sm:text-left">
                                        {formatTime((progress / 100) * (audioRef.current?.duration || videoRef.current?.duration || 0))}
                                        /
                                        <span className="text-black">
                                            {formatTime(audioRef.current?.duration || videoRef.current?.duration || 0)}
                                        </span>
                                    </div>
                                </div>

                                {/* Playback Controls and Volume */}
                                <div className="flex flex-col sm:flex-row items-center justify-between p-2 gap-2">
                                    <div className="flex flex-wrap justify-center gap-1">
                                        <button className="button p-2 flex items-center justify-center text-black" onClick={handlePlayPause}>
                                            {isPlaying ? <FaPause /> : <FaPlay />}
                                        </button>
                                        <button className="button p-2 flex items-center justify-center text-black" onClick={handleRewind}>
                                            <FaStepBackward />
                                        </button>
                                        <button className="button p-2 flex items-center justify-center text-black" onClick={handleForward}>
                                            <FaStepForward />
                                        </button>
                                        <button className="button p-2 flex items-center justify-center text-black" onClick={handleRepeat}>
                                            <FaRedo />
                                        </button>
                                        <button className="button p-2 flex items-center justify-center text-black" onClick={() => window.open(selectedMedia.src, '_blank')}>
                                            <FaDownload />
                                        </button>
                                        <button
                                            className="button px-3 py-2 flex justify-center items-center text-black"
                                            onClick={() => handleCopyLink(window.location.origin + selectedMedia.src)}
                                        >
                                            <FaShareAlt />
                                            {tooltip && (
                                                <span className="absolute left-1/2 transform -translate-x-1/2 mt-2 text-xs bg-white border px-2 py-1">
                                                    Copied!
                                                </span>
                                            )}
                                        </button>
                                    </div>

                                    {/* Volume Slider Section */}
                                    <div className="flex items-center gap-2 w-full sm:w-auto justify-center sm:justify-end mt-2 sm:mt-0">
                                        <FaVolumeUp size={16} className="text-black" />
                                        <input
                                            type="range"
                                            min="0"
                                            max="100"
                                            value={volume}
                                            onChange={(e) => handleVolumeChange(e)}
                                            className="w-24 sm:w-32"
                                        />
                                        <span className="text-sm">{volume}%</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>
        );
    };



    return (
        <motion.div className={`fixed inset-0 flex items-center justify-center  p-4 ${pixelFont.variable}`} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1 }}>
            <div className="window w-full md:max-w-5xl mx-auto">
                <div className="title-bar" style={{ background: 'linear-gradient(90deg, #ff69b4, #ff1493)' }}>
                    <div className="title-bar-text">📁 Boykisser Explorer</div>
                    
                </div>

                <div className="window-body p-4 flex flex-col gap-0">
                    {/* Title Image above Tabs */}
                    <div className="mb-2 self-center">
                        <Image src="/mediaT.png" alt="Media Explorer Title" width={300} height={50} className="object-contain" />
                    </div>
                    {/* Tabs without emojis, icons only */}
                    <menu role="tablist" className="flex gap-0 border-b-0">
                        {tabs.map((tab, index) => (
                            <li key={index} role="tab" aria-selected={activeTab === index} className={`button ${tab.color} ${activeTab === index ? 'selected' : ''} px-4 py-2 rounded-none text-white`} onClick={() => setActiveTab(index)}>
                                {tab.icon} {/* Icon only */}
                            </li>
                        ))}
                    </menu>

                    {/* Path section with icon directly next to the text */}
                    <div className="flex items-center p-2 bg-gray-200 border border-gray-500 mt-0">
                        <span className="text-sm flex items-center gap-1">
                            📂 Path: {/* Folder emoji directly inline with Path: */}
                        </span>
                        <input type="text" value={tabs[activeTab].path} readOnly className="w-full bg-white p-1 border border-gray-400 ml-2" />
                    </div>

                    <div className="window mt-0 p-2 border-t-0">
                        <AnimatePresence mode="wait">
                            <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.5 }}>
                                {renderMediaItems()}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>

                <AnimatePresence>{showOverlay && <motion.div key={activeTab} initial={{ opacity: 0 }} animate={{ opacity: 0.9 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }} className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70 text-white text-3xl font-pixel z-50">{tabs[activeTab].title}</motion.div>}</AnimatePresence>
                <AnimatePresence>{renderMediaModal()}</AnimatePresence>
            </div>
        </motion.div>
    );

}
