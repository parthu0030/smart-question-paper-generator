module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: '#4f8cff',
        secondary: '#3358e6',
        accent: '#ff6b6b',
        dark: '#2d3a4b',
        light: '#f8f9fa'
      },
      boxShadow: {
        'soft': '0 4px 24px rgba(0,0,0,0.08)',
        'hard': '0 8px 32px rgba(0,0,0,0.12)'
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '2rem'
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography')
  ],
}

