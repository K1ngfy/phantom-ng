/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: 'rgba(0, 0, 0, 0.95)',
        card: 'rgba(17, 24, 39, 0.95)',
        border: 'rgba(75, 85, 99, 0.5)',
        primary: '#3b82f6',
        secondary: '#64748b',
        accent: '#10b981',
        danger: '#ef4444',
        warning: '#f59e0b',
      },
      boxShadow: {
        'glow': '0 0 20px rgba(59, 130, 246, 0.3)',
      },
    },
  },
  plugins: [],
};
