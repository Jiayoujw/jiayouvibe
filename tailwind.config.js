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
        primary: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
          950: '#1e1b4b',
        },
        accent: {
          cyan: '#06b6d4',
          purple: '#a855f7',
          pink: '#ec4899',
          amber: '#f59e0b',
        },
        surface: {
          light: '#ffffff',
          DEFAULT: '#f8fafc',
          dark: '#0f172a',
          'dark-alt': '#1e293b',
        },
      },
      fontFamily: {
        sans: ['"Inter"', '"Noto Sans SC"', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"Fira Code"', 'monospace'],
      },
      animation: {
        'glow': 'glow 4s ease-in-out infinite alternate',
        'float': 'float 6s ease-in-out infinite',
        'gradient-shift': 'gradient-shift 8s ease infinite',
        'particle': 'particle 12s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'pulse-glow': 'pulse-glow 3s ease-in-out infinite',
        'slide-up': 'slide-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'gradient-flow': 'gradient-flow 6s ease infinite',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(99, 102, 241, 0.3), 0 0 60px rgba(99, 102, 241, 0.1)' },
          '100%': { boxShadow: '0 0 40px rgba(139, 92, 246, 0.4), 0 0 80px rgba(139, 92, 246, 0.2)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'gradient-shift': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        particle: {
          '0%': { transform: 'translateY(0px) translateX(0px) scale(1)', opacity: '0' },
          '10%': { opacity: '1' },
          '90%': { opacity: '1' },
          '100%': { transform: 'translateY(-120px) translateX(40px) scale(0)', opacity: '0' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'pulse-glow': {
          '0%, 100%': {
            boxShadow: '0 0 12px rgba(6, 182, 212, 0.3), 0 0 30px rgba(6, 182, 212, 0.1)',
            borderColor: 'rgba(6, 182, 212, 0.3)',
          },
          '50%': {
            boxShadow: '0 0 28px rgba(6, 182, 212, 0.6), 0 0 60px rgba(139, 92, 246, 0.3), 0 0 90px rgba(6, 182, 212, 0.15)',
            borderColor: 'rgba(6, 182, 212, 0.7)',
          },
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'gradient-flow': {
          '0%': { backgroundPosition: '0% 50%' },
          '25%': { backgroundPosition: '100% 0%' },
          '50%': { backgroundPosition: '100% 100%' },
          '75%': { backgroundPosition: '0% 100%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
      },
      backgroundSize: {
        '300%': '300% 300%',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
