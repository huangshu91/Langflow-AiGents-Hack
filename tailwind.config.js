/** @type {import('tailwindcss').Config} */
export default {
  important: true,
  content: ["./src/**/*"],
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}

