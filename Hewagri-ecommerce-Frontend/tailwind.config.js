/** @type {import('tailwindcss').Config} */
const plugin = require("tailwindcss/plugin");

module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        dark: "#111722",
        light: "#eeeeee",
        primary: {
          green: "#048343",
          orange: "FF7323",
        },
        secondary: {
          green: "#45b24b",
        },
      },

      fontFamily: {
        montserrat: ["Montserrat", "sans-serif"],
      },
    },
  },
  plugins: [
    plugin(function ({ matchUtilities, theme }) {
      matchUtilities(
        {
          "animate-duration": (value) => ({
            animationDuration: value,
          }),
        },
        { values: theme("transitionDuration") }
      ),
        matchUtilities(
          {
            "animate-delay": (value) => ({
              animationDelay: value,
            }),
          },
          { values: theme("transitionDelay") }
        );
    }),
  ],
};
