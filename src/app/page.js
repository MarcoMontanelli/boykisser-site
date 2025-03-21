'using client'
import Image from "next/image";
import '98.css';
import  Navbar  from "./components/Navbar"
import React from "react";
import SnakeGame from "./components/Snake";
import FlappyBird from "./components/FlappyBird";
import DinoGame from "./components/Dino";
import ParallaxSection from "./components/ParallaxSection";
import Footer from "./components/Footer";
import AboutSection from "./components/About";
import AboutCreator from "./components/Coffee";
import QuickLinks from "./components/QuickLinks";


export default function Home() { 
  return (
    <div className="flex flex-col min-h-screen">
      <ParallaxSection/>
      <AboutSection/>
      <QuickLinks/>
      <AboutCreator/>
    </div>
  );
}


