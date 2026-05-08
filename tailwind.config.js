/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // ── Brand tokens ──────────────────────────────────
        'brand-dark':  '#080c13',
        'brand-blue': {
          DEFAULT: '#4ba3e3',
          hover:   '#60b4f0',
          dim:     '#2563eb',
        },
        'brand-accent': {
          DEFAULT: '#eab308',
          hover:   '#ca8a04',
          dim:     '#a16207',
        },
        // ── Surface / structural ──────────────────────────
        navy: {
          950: '#060A12',
          900: '#0A0F16',
          800: '#0D1420',
          700: '#111827',
          600: '#1F2937',
          500: '#374151',
        },
      },
      fontFamily: {
        cairo:    ['var(--font-cairo)',    'system-ui', 'sans-serif'],
        orbitron: ['var(--font-orbitron)', 'monospace'],
      },
      animation: {
        'pulse-slow':  'pulse 3s cubic-bezier(0.4,0,0.6,1) infinite',
        'fade-up':     'fadeUp 0.7s ease-out both',
        'float':       'float 4s ease-in-out infinite',
        'glow-pulse':  'glowPulse 2.4s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(22px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':       { transform: 'translateY(-8px)' },
        },
        glowPulse: {
          '0%, 100%': { filter: 'drop-shadow(0 0 6px rgba(75,163,227,0.4))' },
          '50%':       { filter: 'drop-shadow(0 0 20px rgba(75,163,227,0.9))' },
        },
      },
    },
  },
  plugins: [],
};

module.exports = config;
