/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        background: "#FAF7F2",
        foreground: "#1C1917",
        border: "#E7E0D5",
        muted: {
          DEFAULT: "#F0EBE3",
          foreground: "#78716C",
        },
        primary: {
          DEFAULT: "#5B4B8A",
          foreground: "#FFFFFF",
        },
        accent: {
          DEFAULT: "#C17C4A",
          foreground: "#FFFFFF",
        },
        shelf: {
          DEFAULT: "#2D6A4F",
          light: "#D8F3DC",
        },
      },
      borderRadius: {
        DEFAULT: "12px",
      },
    },
  },
  plugins: [],
};
