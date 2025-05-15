import { heroui } from '@heroui/theme';
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@heroui/react/dist/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {},
  },
  darkMode: "class",
  plugins: [
    heroui({
      prefix: "heroui",
      addCommonColors: true,
      defaultTheme: "light",
      defaultExtendTheme: "light",
      layout: {},
      themes: {
        light: {
          layout: {},
          colors: {
            background: "#ffffff",
            foreground: "#2f2f2f",
            primary: {
              DEFAULT: "#0090F7",
              foreground: "#ffffff"
            },
            secondary: {
              DEFAULT: "#BA62FC",
              foreground: "#ffffff"
            },
          },
        },
        dark: {
          layout: {},
          colors: {
            background: "#1A1A1A",
            foreground: "#fafafa",
            primary: {
              DEFAULT: "#0090F7",
              foreground: "#ffffff"
            },
            secondary: {
              DEFAULT: "#BA62FC",
              foreground: "#ffffff"
            }
          },
        },
      },
    })
  ],
};
export default config;
