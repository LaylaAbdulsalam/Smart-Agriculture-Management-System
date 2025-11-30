/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "bg-light": "rgb(248 250 252)",
        "bg-dark": "rgb(15 23 42)", 
        "card-light": "rgb(255 255 255)",
        "card-dark": "rgb(30 41 59)",
        "text-light": "rgb(15 23 42)",
        "text-dark": "rgb(248 250 252)",
        "primary": "rgb(34 197 94)",
        "primary-focus": "rgb(22 163 74)",
      },
    },
  },
  plugins: [],
};