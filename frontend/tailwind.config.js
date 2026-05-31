/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/components/**/*.{js,vue,ts}',
    './src/layouts/**/*.vue',
    './src/pages/**/*.vue',
    './src/plugins/**/*.{js,ts}',
    './src/app.vue'
  ],
  theme: {
    extend: {
      fontFamily: {
        pixel: ['"Pixelify Sans"', 'cursive'],
        sans: ['Inter', 'system-ui', 'sans-serif']
      },
      colors: {
        neon: {
          green: '#39FF14',
          purple: '#BF00FF',
          pink: '#FF10F0'
        },
        dark: {
          bg: '#0D0D0F',
          surface: '#1A1A1F',
          card: '#25252B',
          border: '#2E2E36'
        }
      },
      animation: {
        'fade-up': 'fadeUp 0.5s ease-out forwards',
        'slide-in': 'slideInRight 0.4s ease-out forwards',
        'pulse-glow': 'pulseGlow 2s infinite'
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' }
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 5px rgba(57,255,20,0.2)' },
          '50%': { boxShadow: '0 0 20px rgba(57,255,20,0.6)' }
        }
      }
    }
  },
  plugins: []
}
