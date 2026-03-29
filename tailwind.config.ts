import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    { pattern: /^bg-gray-(800|900|950)/ },
    { pattern: /^bg-red-(600|700|900)/ },
    { pattern: /^text-(white|gray|red)-/ },
    { pattern: /^border-(gray|red)-/ },
    { pattern: /^(hover|focus):/ },
    { pattern: /^rounded/ },
    { pattern: /^(flex|grid|space|gap|p|px|py|m|mx|my|w|h|min|max)-/ },
  ],
  theme: {
    extend: {
      colors: {
        red: {
          600: "#dc2626",
          700: "#b91c1c",
        },
      },
    },
  },
  plugins: [],
}

export default config
