/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "alofa-icon" : "/images/alofa-icon.png",
      },
      colors: {
        "alofa-pink" : "#FE699F",
        "alofa-pink-gradient" : "#F8587A",
      },
      fontFamily: {
        'title': ["Yavome", "sans-serif"],
        'body': ["Montserrat", "sans-serif"],
      }
    },
  },
  plugins: [],
}

