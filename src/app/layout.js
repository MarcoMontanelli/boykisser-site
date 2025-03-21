'use client';
import { Press_Start_2P } from "next/font/google"; // Import pixelated font from Google Fonts
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Image from 'next/image';
import { useEffect, useState } from 'react';

const pixelFont = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-pixel",
});

const originalImages = [
  '/backgroundImages/dancing.webp',
  '/backgroundImages/back9.gif',
  '/backgroundImages/back10.png',
  '/backgroundImages/back6.gif',
  '/backgroundImages/back7.gif',
  '/backgroundImages/back11.png',
  '/backgroundImages/back13gif.gif',
  '/backgroundImages/back14.png',
  '/backgroundImages/back15.png',
];

// Function to repeat images to reach 35 entries
const floatingImages = [];
const targetCount = 35;
let currentIndex = 0;

for (let i = 0; i < targetCount; i++) {
  floatingImages.push(originalImages[currentIndex]);
  currentIndex = (currentIndex + 1) % originalImages.length;
}

function FloatingImages() {
  const [positions, setPositions] = useState([]);

  useEffect(() => {
    const initPositions = floatingImages.map(() => ({
      top: Math.random() * 100,
      left: Math.random() * 100,
      dx: (Math.random() - 0.5) * 0.4,
      dy: (Math.random() - 0.5) * 0.4,
    }));

    setPositions(initPositions);

    const moveImages = () => {
      setPositions((prev) =>
        prev.map((pos) => {
          let newTop = pos.top + pos.dy;
          let newLeft = pos.left + pos.dx;

          if (newTop < 0 || newTop > 100) pos.dy *= -1;
          if (newLeft < 0 || newLeft > 100) pos.dx *= -1;

          return {
            top: Math.min(100, Math.max(0, newTop)),
            left: Math.min(100, Math.max(0, newLeft)),
            dx: pos.dx,
            dy: pos.dy,
          };
        })
      );
    };

    const interval = setInterval(moveImages, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden">
      {positions.map((pos, index) => (
        <Image
          key={index}
          src={floatingImages[index]}
          alt={`floating-image-${index}`}
          width={50}
          height={50}
          className="absolute"
          style={{
            top: `${pos.top}vh`,
            left: `${pos.left}vw`,
            objectFit: 'contain',
          }}
          priority
        />
      ))}
    </div>
  );
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${pixelFont.variable} antialiased relative`}>
        <div className="fixed inset-0 bg-gradient-to-br from-gray-300 via-gray-400 to-pink-400 z-0"></div>
        <FloatingImages />
        <div className="relative z-10 min-h-screen flex flex-col font-pixel">
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
