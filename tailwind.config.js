/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        obsidian: '#0a0a0f',
        void: '#050507',
        gunmetal: '#1c1e22',
        slate: '#2a2d33',
        neon: {
          cyan: '#00f6ff',
          violet: '#a855f7',
        },
        amber: {
          DEFAULT: '#ffb020',
          dim: '#8a5a12',
        },
        iridescent: {
          a: '#7dd3fc',
          b: '#e879f9',
          c: '#fde68a',
        },
      },
      fontFamily: {
        geo: ['"Space Grotesk"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
        serif: ['"Cormorant Garamond"', 'serif'],
      },
      backgroundImage: {
        'grid-lines':
          'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)',
      },
      boxShadow: {
        glow: '0 0 40px var(--tw-shadow-color)',
      },
    },
  },
  plugins: [],
};
