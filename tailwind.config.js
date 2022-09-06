/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    fontFamily: {
      sans: ['"Source Sans Pro"', "sans-serif"],
    },
    extend: {
      backgroundImage: {
        "hero-pattern": "url('/src/assets/background.jpg')",
      },
    },
  },
  plugins: [],
};
