import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          DEFAULT: '#F8F4EE',
          secondary: '#F3EEE6',
          light: '#FFF8ED',
        },
        ink: '#121212',
        graphite: '#2B2B2B',
        orange: {
          DEFAULT: '#FF6A3D',
        },
        blue: {
          accent: '#2D4BFF',
        },
        sand: '#E7C9A9',
      },
      fontFamily: {
        display: ['Clash Display', 'General Sans', 'system-ui', 'sans-serif'],
        body: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'fluid-xl': 'clamp(6rem, 16vw, 20rem)',
        'fluid-lg': 'clamp(3rem, 8vw, 10rem)',
        'fluid-md': 'clamp(1.5rem, 3vw, 3rem)',
      },
      letterSpacing: {
        tighter: '-0.04em',
        tight: '-0.02em',
      },
      boxShadow: {
        brutal: '8px 8px 0 #000',
        'brutal-sm': '4px 4px 0 #000',
        'brutal-orange': '8px 8px 0 #FF6A3D',
        'editorial': '0 2px 40px rgba(18,18,18,0.06)',
        'soft': '0 4px 60px rgba(18,18,18,0.08)',
      },
      backgroundImage: {
        'grain': "url('/grain.svg')",
      },
      animation: {
        'float': 'float 8s ease-in-out infinite',
        'orbit': 'orbit 20s linear infinite',
        'pulse-slow': 'pulse 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '33%': { transform: 'translateY(-20px) rotate(1deg)' },
          '66%': { transform: 'translateY(-10px) rotate(-1deg)' },
        },
        orbit: {
          '0%': { transform: 'rotate(0deg) translateX(60px) rotate(0deg)' },
          '100%': { transform: 'rotate(360deg) translateX(60px) rotate(-360deg)' },
        },
      },
      transitionTimingFunction: {
        'premium': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        'cinema': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'back-out': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
    },
  },
  plugins: [],
}

export default config
