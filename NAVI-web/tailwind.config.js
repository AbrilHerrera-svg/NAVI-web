/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navi: {
          DEFAULT: '#5960A1',
          light: '#EEF0FB',
          dark: '#454B80',
        },
      },
    },
  },
  plugins: [],
}