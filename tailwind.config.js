/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx,mdx}', './components/**/*.{js,jsx,ts,tsx,mdx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        highlight: '0 0 35px -15px rgba(16, 185, 129, 0.7)',
      },
    },
  },
  plugins: [],
};
