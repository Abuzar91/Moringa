/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f4f7f4',
          100: '#e6ede6',
          200: '#b7cdb8', 
          300: '#9bc19d',
          400: '#7fb582',
          500: '#63a967',
          600: '#4f8752',
          700: '#3b653e',
          800: '#274329',
          900: '#132115',
        },
        accent: {
          50: '#f7f9f7',
          100: '#e8f0e9',
          200: '#c5d9c7',
          300: '#a2c2a5',
          400: '#7fab83',
          500: '#5c9461',
          600: '#4a764e',
          700: '#38583b',
          800: '#263a28',
          900: '#141c15',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'bounce-gentle': 'bounceGentle 2s infinite',
        'slide-down': 'slideDown 0.5s ease-out',
        'fade-out': 'fadeOut 0.3s ease-in',
        'pulse-gentle': 'pulseGentle 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        pulseGentle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
      },
    },
  },
  plugins: [],
};