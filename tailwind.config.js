/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./public/*.{html,js,css}",
    "./views/*.ejs",
  ],
  theme: {
    backgroundImage: {
      'blpt': "url('/images/neww.png')",
      'formbg': "url('/images/unnamed.jpg')",
    },
    extend: {},
  },
  colors: {
    'regal-blue': '#243c5a',
  },
  plugins: [],
}

