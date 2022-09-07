/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    fontFamily: {
      sans: ["Poppins", "sans-serif"],
    },
    extend: {
      colors: {
        "primary-violet": "#4E38A0",
        "primary-hover": "#674EC5",
        "secondary-hover": "#3B3859",
        "secondary-violet": "#26233E",
      },
      backgroundImage: {
        "hero-pattern": "url('/src/assets/background.png')",
      },
    },
  },
  plugins: [],
};
