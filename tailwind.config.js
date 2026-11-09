/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ivory: '#FBF8F3',
        cream: '#F5EEE4',
        champagne: '#E7D3B5',
        blush: '#F1DDD6',
        rose: '#C98C7A',
        gold: '#B8924A',
        ink: '#2B2522',
        taupe: '#6E625A',
        noir: '#1C1917',
        hairline: '#E4D9CB',
        sage: '#6F8F72',
        garnet: '#A33B3B',
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['Montserrat', 'system-ui', '-apple-system', 'sans-serif'],
      },
      letterSpacing: {
        wordmark: '0.18em',
        label: '0.14em',
      },
      transitionTimingFunction: {
        luxe: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      maxWidth: {
        page: '1280px',
      },
      boxShadow: {
        soft: '0 12px 40px rgba(43, 37, 34, 0.08)',
      },
      aspectRatio: {
        '4/5': '4 / 5',
      },
    },
  },
  plugins: [],
};

