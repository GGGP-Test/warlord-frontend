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
        warlord: {
          primary: '#0F172A',
          secondary: '#1E293B',
          accent: '#38BDF8',
          success: '#10B981',
          warning: '#F59E0B',
          error: '#EF4444',
        },
      },
    },
  },
  plugins: [],
}
