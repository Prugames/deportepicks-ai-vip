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
        dark: {
          950: '#07090e',
          900: '#0c1017',
          850: '#111722',
          800: '#161f2e',
          750: '#1d283a',
          700: '#253347',
          600: '#344661',
        },
        brand: {
          cyan: '#00f2fe',
          teal: '#4facfe',
          emerald: '#10b981',
          lime: '#22c55e',
          neon: '#00ff87',
          gold: '#fbbf24',
          amber: '#f59e0b',
          rose: '#f43f5e',
          purple: '#a855f7',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Cabinet Grotesk', 'Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        'neon-cyan': '0 0 20px -3px rgba(0, 242, 254, 0.4)',
        'neon-emerald': '0 0 20px -3px rgba(16, 185, 129, 0.4)',
        'neon-gold': '0 0 20px -3px rgba(251, 191, 36, 0.4)',
        'neon-rose': '0 0 20px -3px rgba(244, 63, 94, 0.4)',
        'card-glow': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow-spin': 'spin 8s linear infinite',
        'ticker': 'ticker 35s linear infinite',
      },
      keyframes: {
        ticker: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        }
      }
    },
  },
  plugins: [],
}
