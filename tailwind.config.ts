import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0a0a0a",
        foreground: "#ededed",
        card: "#171717",
        "card-foreground": "#ededed",
        border: "#262626",
        primary: "#ffffff",
        "primary-foreground": "#000000",
        muted: "#262626",
        "muted-foreground": "#a3a3a3",
        accent: "#333333",
        "accent-foreground": "#ffffff",
      },
    },
  },
  plugins: [],
};
export default config;
