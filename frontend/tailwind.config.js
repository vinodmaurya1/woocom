/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
  extend: {
    animation: {
      'bounce-slow': 'bounce 3s infinite',
      'pulse-slow': 'pulse 3s infinite',
    }
  }
}
