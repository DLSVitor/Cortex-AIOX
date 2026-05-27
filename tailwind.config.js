export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        vantablack: '#030303',
        surface: '#0A0A0A',
        gold: {
          bright: '#D4AF37',
          muted: '#998036',
          dim: '#54451D',
          glow: 'rgba(212, 175, 55, 0.08)'
        },
        noir: {
          shadow: 'rgba(0, 0, 0, 0.9)'
        }
      },
      fontFamily: {
        executive: ['Inter', 'Helvetica Neue', 'sans-serif'],
      },
      boxShadow: {
        chiaroscuro: '0 20px 40px -10px rgba(0, 0, 0, 0.9), 0 0 30px rgba(212, 175, 55, 0.08)',
        'chiaroscuro-sm': '0 10px 10px -10px rgba(212, 175, 55, 0.08)',
        'glow': '0 0 20px rgba(212, 175, 55, 0.08)'
      },
      letterSpacing: {
        executive: '0.15em',
        executiveWide: '0.25em',
      }
    },
  },
  plugins: [],
}
