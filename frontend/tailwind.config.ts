import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        bg:       '#080808',
        card:     '#0f0f0f',
        border:   '#1a1a1a',
        cyan:     '#00f5ff',
        muted:    '#555555',
        success:  '#00ff88',
        warn:     '#ffaa00',
        danger:   '#ff4444',
      },
      fontFamily: {
        sans:  ['DM Mono', 'monospace'],
        mono:  ['DM Mono', 'monospace'],
        display: ['Syne', 'sans-serif'],
      },
      animation: {
        'fade-in':    'fadeIn 0.4s ease forwards',
        'slide-up':   'slideUp 0.4s ease forwards',
        'pulse-cyan': 'pulseCyan 2s ease-in-out infinite',
        'ticker':     'ticker 30s linear infinite',
      },
      keyframes: {
        fadeIn:    { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp:   { from: { opacity: '0', transform: 'translateY(12px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        pulseCyan: { '0%,100%': { opacity: '1' }, '50%': { opacity: '0.4' } },
        ticker:    { from: { transform: 'translateX(0)' }, to: { transform: 'translateX(-50%)' } },
      },
    },
  },
  plugins: [],
}
export default config