import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#E52E2D",
        "primary-hover": "#C12A26",
        "primary-light": "#FEF2F2",
        "primary-border": "#FCA5A5",
        "pustaka-red": "#E52E2D",
        "pustaka-green": "#388E3C",
        "pustaka-black": "#1A1A1A",
      },
    },
  },
  plugins: [],
};

export default config;
