/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './ui/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'cormorant': ['var(--font-cormorant)', 'serif'],
        'dancing': ['var(--font-dancing)', 'cursive'],
        'inter': ['var(--font-inter)', 'sans-serif'],
        'allura': ['var(--font-allura)', 'cursive'],
        'great-vibes': ['var(--font-great-vibes)', 'cursive'],
        'satisfy': ['var(--font-satisfy)', 'cursive'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}
