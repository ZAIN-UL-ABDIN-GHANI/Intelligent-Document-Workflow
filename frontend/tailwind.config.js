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
        brand: {
          50:  '#f0f4ff',
          100: '#dce6ff',
          200: '#b9ceff',
          300: '#85a8ff',
          400: '#4d7bff',
          500: '#1a50f5',
          600: '#0c3de8',
          700: '#0a2fcb',
          800: '#0e27a3',
          900: '#112581',
          950: '#0b164f',
        },
        surface: {
          DEFAULT: '#0f1117',
          card:    '#161b27',
          border:  '#1e2638',
          hover:   '#1c2333',
        },
        accent: {
          cyan:    '#06b6d4',
          violet:  '#7c3aed',
          emerald: '#10b981',
          amber:   '#f59e0b',
        },
      },
      fontFamily: {
        sans:  ['Inter', 'system-ui', 'sans-serif'],
        mono:  ['JetBrains Mono', 'Fira Code', 'monospace'],
        display: ['Space Grotesk', 'Inter', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4,0,0.6,1) infinite',
        'fade-in':    'fadeIn 0.25s ease-out',
        'slide-up':   'slideUp 0.3s ease-out',
        'typing':     'typing 1.4s ease-in-out infinite',
      },
      keyframes: {
        fadeIn:  { from: { opacity: 0 }, to: { opacity: 1 } },
        slideUp: { from: { opacity: 0, transform: 'translateY(8px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        typing:  {
          '0%, 80%, 100%': { transform: 'scale(0.6)', opacity: '0.4' },
          '40%':            { transform: 'scale(1)',   opacity: '1'   },
        },
      },
      boxShadow: {
        glow:    '0 0 20px rgba(26, 80, 245, 0.25)',
        'glow-cyan': '0 0 20px rgba(6, 182, 212, 0.2)',
      },
    },
  },
  plugins: [],
}
