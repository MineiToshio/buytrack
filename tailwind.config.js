const { colors } = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: "#22c55e",
          DEFAULT: "#22c55e",
        },
        secondary: {
          light: "#1e3a8a",
          DEFAULT: "#1e3a8a",
        },
        muted: {
          light: "#a1a1aa",
          DEFAULT: "#a1a1aa",
        },
        error: {
          light: "#ef4444",
          DEFAULT: "#ef4444",
        },
      },
    },
  },
  plugins: [],
};
