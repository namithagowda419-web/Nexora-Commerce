/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // NEXORA Brand Color Palette
        violet: {
          electric: '#7C3AED',
          dark: '#5B21B6',
          light: '#A78BFA',
        },
        coral: {
          neon: '#FF6B8A',
          dark: '#E11D48',
        },
        cyan: {
          soft: '#67E8F9',
          bright: '#06B6D4',
        },
        midnight: {
          bg: '#0F1021',
          darker: '#080914',
          card: '#1B1C3A',
          border: '#2E3058',
        },
        lavender: {
          light: '#D8B4FE',
          soft: '#C084FC',
        },
        text: {
          main: '#F8FAFC',
          muted: '#94A3B8',
        }
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
      },
      boxShadow: {
        '3d-glow': '0 20px 50px -10px rgba(124, 58, 237, 0.35), 0 10px 20px -5px rgba(255, 107, 138, 0.2)',
        'cyan-glow': '0 0 25px rgba(103, 232, 249, 0.4)',
        'card-3d': '0 15px 35px -5px rgba(15, 16, 33, 0.8), 0 0 15px rgba(124, 58, 237, 0.15)',
      }
    },
  },
  plugins: [],
}
