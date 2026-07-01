/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        twitter: {
          blue: '#1D9BF0',
          dark: '#0F1419',
          darker: '#000000',
          border: '#2F3336',
          hover: '#1A1F23',
          text: '#71767B',
          white: '#E7E9EA',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
