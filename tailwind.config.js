/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,vue}'],
  theme: {
    extend: {
      height: {
        '90vh': '90vh',
      },
      maxWidth: {
        '3/4': '75%',
      },
      colors: {
        green: '#42b883',
        'gray-Any': '#0f172a',
      },
    },
  },
}
