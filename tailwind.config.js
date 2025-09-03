module.exports = {
  darkMode: 'class', // IMPORTANT: use class-based dark mode
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    // extend: {},
    extend: {
  animation: {
    'fade-in-down': 'fadeInDown 0.5s ease-out both',
  },
  keyframes: {
    fadeInDown: {
      '0%': { opacity: 0, transform: 'translateY(-20px)' },
      '100%': { opacity: 1, transform: 'translateY(0)' },
    },
  },
},



  },
  plugins: [],
}


