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
        serif: ['"GFS Didot"', 'serif'],
        sans: ['"Plus Jakarta Sans"', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        // Dynamic Design System Tokens from design-tokens.md
        canvas: 'var(--bg-canvas)',
        'surface-card': 'var(--surface-card)',
        'surface-subtle': 'var(--surface-subtle)',
        'border-line': 'var(--border-line)',
        'border-subtle': 'var(--border-line-subtle)',
        'text-primary': 'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
        'text-muted': 'var(--text-muted)',
        'status-green': 'var(--status-green)',
        'toggle-neutral': 'var(--toggle-neutral)',
        
        // Semantic fixed references
        charcoal: '#1C1B1F',
        offwhite: '#FFFFF5',
      },
      borderRadius: {
        'xl': '28px',
        'lg': '20px',
        'pill': '9999px',
      },
      boxShadow: {
        'hero-card': '0 16px 40px rgba(0, 0, 0, 0.12)',
        'inner-frame': '0 -2px 16px rgba(0, 0, 0, 0.04)',
        'card-soft': '0 8px 30px rgba(0, 0, 0, 0.04)',
        'card-hover': '0 20px 45px rgba(0, 0, 0, 0.08)',
        'dark-card': '0 16px 40px rgba(0, 0, 0, 0.5)',
      },
      keyframes: {
        'faq-reveal': {
          '0%': { opacity: '0', transform: 'translateY(-6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'pulse-subtle': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.85', transform: 'scale(1.02)' },
        }
      },
      animation: {
        'faq-reveal': 'faq-reveal 0.25s ease-out forwards',
        'fade-in': 'fade-in 0.3s ease-out forwards',
        'slide-up': 'slide-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'pulse-subtle': 'pulse-subtle 3s ease-in-out infinite',
      }
    },
  },
  plugins: [],
}
