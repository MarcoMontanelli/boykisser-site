'use client';
import { Press_Start_2P } from "next/font/google"; // Import pixelated font from Google Fonts

import { motion } from "framer-motion";

const pixelFont = Press_Start_2P({
    weight: "400",
    subsets: ["latin"],
    variable: "--font-pixel",
});


const Main = () => {
    return (
        <>
            <div className="fixed inset-0 bg-gradient-to-br from-gray-300 via-gray-400 to-pink-400 z-0"></div>
            {/* Background animato */}
            <motion.div
                className="absolute inset-0 filter blur-sm opacity-60"
                style={{ backgroundImage: "url('/original2.gif')" }}
                initial={{ scale: 1.2, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
            ></motion.div>
            
        </>
    );
};

export default Main;
