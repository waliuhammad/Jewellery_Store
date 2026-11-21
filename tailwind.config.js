/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Storefront tokens
        ivory: '#FBF8F1',
        cream: '#F4EFE2',
        champagne: '#EADCB4',
        mist: '#E3E9DA',
        forest: '#0F3D33',
        emerald: '#1E5E4E',
        deep: '#0A2A22',
        maroon: '#6A1724',
        gold: '#B88F45',
        ink: '#1E2A25',
        moss: '#566558',
        hairline: '#DDD8C3',
        ink: '#1A211E',
        moss: '#4A554C',
        hairline: '#D4C6B1',
        leaf: '#2F7A50',
        alert: '#B3261E',
        // Admin panel extra tokens — Champagne & Rose palette
        paper: '#FFFDFA',
        blush: '#F1DDD6',
        rose: '#C98C7A',
        taupe: '#6E625A',
        noir: '#1C1917',
        sage: '#6F8F72',
        garnet: '#A33B3B',
        // Admin panel extra tokens — Champagne & Rose palette (Enhanced contrast & legibility)
        paper: '#FFFFFF',
        blush: '#F0DBD4',
        rose: '#B86F5C',
        taupe: '#4A3F39',
        noir: '#171514',
        sage: '#265C34',
        garnet: '#9A2626',
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['Montserrat', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        wordmark: '0.18em',
        logo: '0.3em',
        label: '0.14em',
      },
      transitionTimingFunction: {
        luxe: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      maxWidth: {
        page: '1280px',
      },
      boxShadow: {
        soft: '0 12px 40px rgba(30, 42, 37, 0.08)',
      },
      aspectRatio: {
        '4/5': '4 / 5',
      },
    },
  },
  plugins: [],
};
