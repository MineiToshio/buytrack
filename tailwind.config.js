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
        muted: {
          light: "#a1a1aa",
          DEFAULT: "#a1a1aa",
        },
      },
    },
  },
  plugins: [],
};
