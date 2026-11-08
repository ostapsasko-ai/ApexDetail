import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        asphalt: "#08090B",
        carbon: "#15171B",
        signal: "#E50914",
        silver: "#B9BEC8",
        track: "#F6F7F8"
      },
      fontFamily: {
        display: ["Bahnschrift", "Arial Narrow", "sans-serif"],
        body: ["Segoe UI", "Inter", "sans-serif"]
      }
    }
  },
  plugins: []
};

export default config;
