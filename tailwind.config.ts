import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    container: { center: true, padding: '1rem', screens: { '2xl': '1280px' } },
    extend: {
      // Hex literals (not CSS variables) so opacity modifiers like bg-espresso/50 work.
      // Keep in sync with the variables in globals.css.
      colors: {
        // Jewelora palette
        ivory: '#f6f0e8',
        champagne: '#e9ded1',
        gold: '#d8c1a0',
        antique: '#a98455',
        'gold-deep': '#7f613a',
        line: '#e0d3c2',
        espresso: '#49382f',
        // Legacy names, mapped onto the palette
        background: '#f6f0e8',
        blush: '#e9ded1',
        rose: '#7f613a',
        'rose-border': '#e0d3c2',
        ink: '#49382f',
        muted: '#6b5d53',
        card: '#ffffff',
      },
      fontFamily: {
        heading: ['var(--font-heading)', 'Georgia', 'serif'],
        body: ['var(--font-body)', 'system-ui', 'sans-serif'],
      },
      // Near-square corners: editorial, not app-like
      borderRadius: {
        card: '2px',
        button: '0px',
      },
      boxShadow: {
        soft: '0 1px 2px rgba(73,56,47,0.04), 0 12px 32px -12px rgba(73,56,47,0.12)',
      },
      transitionTimingFunction: {
        luxe: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      keyframes: {
        'slow-zoom': { from: { transform: 'scale(1.08)' }, to: { transform: 'scale(1)' } },
      },
      animation: {
        'slow-zoom': 'slow-zoom 9s cubic-bezier(0.22, 1, 0.36, 1) both',
      },
      maxWidth: { content: '1320px' },
    },
  },
  plugins: [],
};

export default config;
