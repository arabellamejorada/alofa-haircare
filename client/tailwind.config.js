/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        'title': ["Yavome", "sans-serif"],
      },
      colors: {
        "alofa-pink": "#FE699F",
        "alofa-pink-gradient": "#F8587A",
        "alofa-light-pink": "#EFB3C0",
        "alofa-white": "#FFF8FC",
        "alofa-black": "#000000",
      },
    },
  },
  plugins: [],
};
