import type { Config } from 'tailwindcss'

export default {
  content: ['./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          '"Inter"',
          'ui-sans-serif',
          'system-ui',
          'sans-serif',
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
          '"Segoe UI Symbol"',
          '"Noto Color Emoji"',
        ],
      },
      animation: {
        glow: 'glow 3s ease-in-out infinite',
        twinkle: 'twinkle 3s ease-in-out infinite',
        gradient: 'gradient 3s ease infinite',
      },
      keyframes: {
        glow: {
          '0%, 100%': { filter: 'drop-shadow(0 0 2px rgba(252, 211, 77, 0.7))' },
          '50%': { filter: 'drop-shadow(0 0 10px rgba(252, 211, 77, 0.9))' },
        },
        twinkle: {
          '0%, 100%': { filter: 'drop-shadow(0 0 2px rgba(226, 232, 240, 0.7))' },
          '50%': { filter: 'drop-shadow(0 0 6px rgba(226, 232, 240, 0.9))' },
        },
        gradient: {
          '0%, 100%': { 'background-position': '0% 50%' },
          '50%': { 'background-position': '100% 50%' },
        },
      },
    },
  },
  plugins: [],
} satisfies Config
