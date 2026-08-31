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
        "pustaka-red": "#D32F2F",
        "pustaka-green": "#388E3C",
        "pustaka-black": "#1A1A1A",
      },
    },
  },
  plugins: [],
};

export default config;
