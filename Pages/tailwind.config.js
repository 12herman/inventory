/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      screens:{
        'xs': '300px',
        'xm':'400px'
      }
    },
  },
  plugins: [],
}