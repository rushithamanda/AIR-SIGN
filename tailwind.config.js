/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
        'spin-slow': 'spin 3s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'shimmer': 'shimmer 2s linear infinite',
        'quantum': 'quantum 4s ease-in-out infinite',
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'glow': '0 0 20px rgba(59, 130, 246, 0.5)',
        'glow-green': '0 0 20px rgba(34, 197, 94, 0.5)',
        'glow-red': '0 0 20px rgba(239, 68, 68, 0.5)',
        'glow-yellow': '0 0 20px rgba(234, 179, 8, 0.5)',
        'glow-purple': '0 0 20px rgba(147, 51, 234, 0.5)',
        'glow-teal': '0 0 20px rgba(20, 184, 166, 0.5)',
        'quantum': '0 0 40px rgba(147, 51, 234, 0.3), 0 0 80px rgba(59, 130, 246, 0.2)',
        'holographic': '0 0 60px rgba(20, 184, 166, 0.4), inset 0 0 60px rgba(147, 51, 234, 0.1)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(59, 130, 246, 0.5)' },
          '100%': { boxShadow: '0 0 40px rgba(59, 130, 246, 0.8), 0 0 60px rgba(59, 130, 246, 0.3)' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        quantum: {
          '0%, 100%': { 
            transform: 'scale(1) rotate(0deg)',
            filter: 'hue-rotate(0deg)'
          },
          '25%': { 
            transform: 'scale(1.05) rotate(90deg)',
            filter: 'hue-rotate(90deg)'
          },
          '50%': { 
            transform: 'scale(1.1) rotate(180deg)',
            filter: 'hue-rotate(180deg)'
          },
          '75%': { 
            transform: 'scale(1.05) rotate(270deg)',
            filter: 'hue-rotate(270deg)'
          },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'holographic': 'linear-gradient(45deg, rgba(20, 184, 166, 0.1), rgba(147, 51, 234, 0.1), rgba(59, 130, 246, 0.1))',
      },
    },
  },
  plugins: [],
};