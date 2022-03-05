module.exports = {
  content: ["**/*.html", "**/*.js"],
  theme: {
    extend: {
      colors: {
        mypurple: {
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
      animation: {
        "push-box": "push-box 1s infinite ease-in-out",
      },
      keyframes: {
        "push-box": {
          "0%": {
            transform: "rotate(0deg)",
          },
          "70%": {
            transform: "rotate(20deg)",
          },
          "90%": {
            transform: "rotate(90deg)",
          },
          "100%": {
            transform: "rotate(90deg)",
          },
        },
      },
    },
  },
  plugins: ["@tailwindcss/typography"],
};
