/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: { game: ['Rubik', 'system-ui', 'sans-serif'] },
      colors: {
        cream: '#fff6df', parchment: '#fdf0cf', sand: '#f1dcaa', bark: '#5a3b22', ink: '#3b2514',
        amberq: '#ffb83d', terracotta: '#e5704a', leaf: '#5cc26b', lagoon: '#2fa6b8', plum: '#8a5cc2', night: '#17323d',
      },
      boxShadow: {
        chunky: '0 5px 0 rgba(60,30,10,.35), 0 10px 18px rgba(30,15,5,.25)',
        glow: '0 0 0 3px rgba(255,214,102,.55), 0 8px 24px rgba(255,184,61,.45)',
      },
      keyframes: {
        floaty: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-6px)' } },
        pulseRing: { '0%': { transform: 'scale(.9)', opacity: '.8' }, '100%': { transform: 'scale(1.5)', opacity: '0' } },
        shake: { '0%,100%': { transform: 'translateX(0)' }, '25%': { transform: 'translateX(-7px)' }, '75%': { transform: 'translateX(7px)' } },
      },
      animation: { floaty: 'floaty 3s ease-in-out infinite', ring: 'pulseRing 1.4s ease-out infinite', shake: 'shake .35s' },
    },
  },
  plugins: [],
};
