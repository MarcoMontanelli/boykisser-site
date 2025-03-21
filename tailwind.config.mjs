/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,jsx,ts,tsx,mdx}",
    "./src/components/ui/**/*.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        memePink: '#ff69b4',
      },
      fontFamily: {
        meme: ['Comic Sans MS', 'cursive', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
