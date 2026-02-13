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
        background: {
          DEFAULT: '#0B1120',
          alt: '#0F172A',
        },
        surface: {
          DEFAULT: '#1E293B',
          hover: '#273449',
        },
        primary: {
          500: '#2563EB', // Electric Blue (Option A)
          600: '#1D4ED8',
        },
        indigo: {
          500: '#4F46E5', // Option B (Indigo)
        },
        secondary: {
          cyan: '#22D3EE',
          violet: '#8B5CF6',
        },
        text: {
          primary: '#E2E8F0',
          muted: '#94A3B8',
          disabled: '#64748B',
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
