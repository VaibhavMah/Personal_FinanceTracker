/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    extend: {
      colors: {
        primary: '#6366F1',
        'primary-dark': '#4F46E5',
        'primary-light': '#818CF8',
        accent: '#A78BFA',
        surface: '#1E293B',
        background: '#0F172A',
      }
    },
  },
  
  plugins: [],
}


