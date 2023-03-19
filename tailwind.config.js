/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,vue}'],
  theme: {
    extend: {
      maxWidth: {
        '3/4': '75%',
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar-hide'),
  ],
}
