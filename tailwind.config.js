/** @type {import('tailwindcss').Config} */
const config = {
  content: ["./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#7A1F3D",
        accent: "#C9A227",
        soft: "#F8E8EC",
        bg: "#FFFBF5",
        text: "#2B2B2B",
      },
      fontFamily: {
        display: ["var(--font-playfair)", "serif"],
        sans: ["var(--font-inter)", "var(--font-hind)", "sans-serif"],
        bangla: ["var(--font-hind)", "sans-serif"],
      },
    },
  },
};

export default config;
