/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        kenao: ['Kenao', 'sans-serif'],
        // This sets Poppins as the default sans-serif font
        sans: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
}