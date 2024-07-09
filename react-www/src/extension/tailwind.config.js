module.exports = {
  content: [
    "./src/**/*.{html,tsx,ts}"
  ],
  theme: {
    extend: {
      keyframes: {
        slideDown: {
          '0%': { transform: 'translateY(-100%)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
        spin: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' }
        },
      },
      animation: {
        slideDown: 'slideDown 1s ease-in-out',
        spin: 'spin 1s linear infinite',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'), // This adds the prose classes
  ],
};