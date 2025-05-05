import { Press_Start_2P } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AnimatedBackground from "./components/AnimatedBackground"; // 👈 client-side animation

// Font setup
const pixelFont = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-pixel",
});

// Viewport settings
export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff"
};

// Metadata
export const metadata = {
  metadataBase: new URL("https://boykisser.zyrofoxx.com"),
  title: "Boykisser Quiz",
  description: "A chaotic meme-powered quiz designed to test your true boykisser energy. Made with love by ZyroFox.",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Boykisser Quiz",
    url: "https://boykisser.zyrofoxx.com",
    title: "Boykisser Quiz",
    description: "A chaotic meme-powered quiz designed to test your true boykisser energy.",
    images: [
      {
        url: "https://boykisser.zyrofoxx.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "Boykisser Quiz Banner"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Boykisser Quiz",
    description: "A chaotic meme-powered quiz designed to test your true boykisser energy.",
    images: ["https://boykisser.zyrofoxx.com/og-image.png"]
  },
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
    googleBot: "index, follow"
  },
  alternates: {
    canonical: "https://boykisser.zyrofoxx.com",
    types: {
      "application/rss+xml": "https://boykisser.zyrofoxx.com/rss.xml"
    }
  },
  applicationName: "Boykisser quiz",
  appleWebApp: {
    title: "Boykisser quiz | Zyrofox",
    statusBarStyle: "default",
    capable: true
  },
  icons: {
    icon: [
      { url: "/favicon.ico", type: "image/x-icon" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
    ],
    shortcut: [
      { url: "/favicon.ico", type: "image/x-icon" }
    ],
    apple: [
      { url: "/apple-icon-57x57.png", sizes: "57x57", type: "image/png" },
      { url: "/apple-icon-60x60.png", sizes: "60x60", type: "image/png" },
      { url: "/apple-icon-72x72.png", sizes: "72x72", type: "image/png" },
      { url: "/apple-icon-76x76.png", sizes: "76x76", type: "image/png" },
      { url: "/apple-icon-114x114.png", sizes: "114x114", type: "image/png" },
      { url: "/apple-icon-120x120.png", sizes: "120x120", type: "image/png" },
      { url: "/apple-icon-144x144.png", sizes: "144x144", type: "image/png" },
      { url: "/apple-icon-152x152.png", sizes: "152x152", type: "image/png" },
      { url: "/apple-icon-180x180.png", sizes: "180x180", type: "image/png" }
    ]
  }
};

// Layout component
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${pixelFont.variable} antialiased relative`}>
        <div className="fixed inset-0 bg-gradient-to-br from-gray-300 via-gray-400 to-pink-400 z-0"></div>
        
        {/* Client-side animated background */}
        <AnimatedBackground />

        <div className="relative z-10 min-h-screen flex flex-col font-pixel">
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
