/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'alofa-bg-white': "url('/static/alofa-white-bg.png')",
        "body-bg" : '/images/body-bg.png',
        "alofa-icon" : "/images/alofa-icon.png",
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
        'title': ['Yavome', 'serif'],
        'title1': ["Kaftan"],
        'heading': ['Yeseva One', 'serif'],
        'body': ["Montserrat", "serif"],
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

