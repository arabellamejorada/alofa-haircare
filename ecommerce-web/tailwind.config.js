/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "body-bg" : './public/images/body-bg.png',
        "alofa-icon" : "./public/images/alofa-icon.png",
        "navbar-bg" : "../public/static/alofa-navbar-white.png",
        "checkout-gradient" : "linear-gradient(180deg, #FF82AF 49%, #FFD1E3 100%)",
      },
      colors: {
        "alofa-pink" : "#FE699F",
        "alofa-pink-gradient" : "#F8587A",
        "alofa-light-pink" : "#EFB3C0",
        "alofa-white" : "#FFF8FC"

      },
      fontFamily: {
        'title': ['Yavome', 'sans-serif'],
        'heading': ['Yeseva One', 'sans-serif'],
        'body': ["Montserrat", "sans-serif"],
      }
    },
  },
  plugins: [
    function({ addUtilities }) {
      const newUtilities = {
        '.gradient-heading': {
          '@apply bg-gradient-to-r from-alofa-pink to-alofa-light-pink bg-clip-text text-transparent': {},
        },
      }
      addUtilities(newUtilities, ['responsive', 'hover']);
    },
  ],
}

