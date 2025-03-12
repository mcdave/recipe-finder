/** @type {import('tailwindcss').Config} */
import forms from "@tailwindcss/forms";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          tomato: {
            50: "#fff1f1",
            100: "#ffe1e1",
            200: "#ffc7c7",
            300: "#ffa0a0",
            400: "#ff6b6b",
            500: "#ff3b3b",
            600: "#ed1515",
            700: "#c80d0d",
            800: "#a50f0f",
            900: "#881414",
          },

          herb: {
            50: "#f4f9f4",
            100: "#e6f3e6",
            200: "#cce5cc",
            300: "#a3d1a3",
            400: "#70b670",
            500: "#4a9c4a",
            600: "#3b7d3b",
            700: "#326432",
            800: "#2b502b",
            900: "#244224",
          },
          golden: {
            50: "#fefbe8",
            100: "#fff7c2",
            200: "#ffea89",
            300: "#ffd649",
            400: "#ffc31f",
            500: "#faa307",
            600: "#dc7902",
            700: "#b65205",
            800: "#94400c",
            900: "#7a350f",
          },
        },
      },
    },
  },
  plugins: [forms],
};
