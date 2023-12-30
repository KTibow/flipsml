export default {
  content: ["**/*.{html,svelte}"],
  theme: {
    extend: {
      colors: {
        theme: {
          50: "hsl(261.2, 36%, 80.0%)",
          100: "hsl(261.2, 36%, 70.0%)",
          200: "hsl(261.2, 34%, 60.0%)",
          300: "hsl(261.2, 32%, 35.0%)",
          400: "hsl(261.2, 30%, 30.0%)",
          500: "hsl(261.2, 28%, 25.0%)",
          600: "hsl(261.2, 26%, 20.0%)",
          700: "hsl(261.2, 24%, 16.7%)",
          800: "hsl(261.2, 22%, 13.3%)",
          900: "hsl(261.2, 20%, 10.0%)",
        },
      },
      fontFamily: {
        sans: ["Inter", "Roboto", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: ["@tailwindcss/typography"],
};
