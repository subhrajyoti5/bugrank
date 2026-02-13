/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Premium Dark Palette
        background: '#1a2a4a', // Deep Navy
        'deep-navy': '#1a2a4a',
        'premium-slate': '#1f3a5a',
        'electric-indigo': '#5050c8',
        'indigo-cyan': '#50c8c8',
        'cyan-violet': '#c850c8',
        'premium-text': '#e0e0ff',
        'premium-muted': '#a0a0c0',
        
        // Maintained for compatibility
        primary: {
          500: '#5050c8', // Electric Indigo
          600: '#3838a8',
        },
        secondary: {
          cyan: '#50c8c8',
          violet: '#c850c8',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in',
        'slide-up': 'slideUp 0.4s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
