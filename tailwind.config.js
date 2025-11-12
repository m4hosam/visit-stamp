/** @type {import('tailwindcss').Config} */

module.exports = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,jsx,ts,tsx,mdx}',
    './components/**/*.{js,jsx,ts,tsx,mdx}',
    './src/**/*.{js,jsx,ts,tsx,mdx}',
    './features/**/*.{js,jsx,ts,tsx,mdx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
    },
  },
  plugins: [],
};
