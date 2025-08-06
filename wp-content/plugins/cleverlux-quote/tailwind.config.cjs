module.exports = {
  content: [
    './assets/js/**/*.{js,jsx,ts,tsx}',
    './**/*.php'
  ],
  theme: {
    extend: {
      colors: {
        'navy-900': '#0A1A2F',
        'navy-600': '#12365C',
        'gold-500': '#D8C28A',
        'gold-300': '#E8D8B4'
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif']
      }
    }
  },
  plugins: []
};
