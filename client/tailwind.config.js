/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        "body-bg": "./public/images/body-bg.png",
        "alofa-icon": "./public/images/alofa-icon.png",
        "navbar-bg": "./public/images/alofa-icon.png",
      },
      colors: {
        alofa: {
          pink: "#FE699F",
          highlight: "#FF93BA",
          dark: "#ED5D91",
          white: "#FFFFFF",
        },
        /* "alofa-pink": "#FE699F",
        "alofa-pink-gradient": "#F8587A",
        "alofa-light-pink": "#EFB3C0",
        "alofa-black": "#000000", */
      },
      fontFamily: {
        title: ["Yavome", "sans-serif"],
        heading: ["Yeseva One", "sans-serif"],
        body: ["Montserrat", "sans-serif"],
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      const newUtilities = {
        ".gradient-heading": {
          "@apply bg-gradient-to-r from-alofa-pink to-alofa-light-pink bg-clip-text text-transparent":
            {},
        },
      };
      addUtilities(newUtilities, ["responsive", "hover"]);
    },
  ],
};
