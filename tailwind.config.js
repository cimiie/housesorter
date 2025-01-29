import { nextui } from "@nextui-org/react";

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {},
  },
  darkMode: "class",
  plugins: [nextui({
    prefix: "nextui", // prefix for themes
    addCommonColors: true, // override common colors (e.g. "blue", "green", "red")
    defaultTheme: "light", // default theme from the themes object
    defaultExtendTheme: "light", // default theme to extend on custom themes
    layout: {}, // common layout tokens (applied to all themes)
    themes: {
      light: {
        layout: {}, // light theme layout tokens
        colors: {
          background: "#FFFFFF",
          foreground: "#11181C",
          content1: "#FFFFFF",
          content2: "#F8F9FA",
          default: {
            50: "#F8F9FA",
            100: "#FFFFFF"
          }
        }
      },
      dark: {
        layout: {}, // dark theme layout tokens
        colors: {
          background: "#000000",
          foreground: "#ECEDEE",
          content1: "#16181A",
          content2: "#27272a",
          default: {
            50: "#16181A",
            100: "#27272a"
          }
        }
      }
    }
  })],
}

export default config;

