import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#0a0a0a',
        surface: {
          DEFAULT: '#141414',
          2: '#1c1c1c',
        },
        border: '#2a2a2a',
        accent: {
          DEFAULT: '#c8ff00',
          dim: '#8aaa00',
        },
        text: {
          DEFAULT: '#f0f0f0',
          muted: '#737373',
        },
        better: '#22c55e',
        worse: '#ef4444',
        'diff-bg': 'rgba(200,255,0,0.06)',
      },
      fontFamily: {
        serif: ['"Instrument Serif"', 'serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
};

export default config;
