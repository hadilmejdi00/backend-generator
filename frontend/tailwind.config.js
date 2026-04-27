/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#7C3AED',
        secondary: '#4C1D95',
        dark: '#0F0F1A',
        card: '#1A1A2E',
        border: '#2D2D44',
      }
    },
  },
  plugins: [],
}