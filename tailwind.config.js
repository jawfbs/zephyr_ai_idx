/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'realtor-red': '#d92228',
        'realtor-dark': '#1a1a2e',
        'realtor-gray': '#6b7280',
        'realtor-light': '#f8f9fa',
        'realtor-border': '#e5e7eb',
        'zephyr-blue': '#1d4ed8',
        'zephyr-light': '#dbeafe',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
