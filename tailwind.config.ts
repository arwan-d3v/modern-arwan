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
        background: "#0A0A0A",
        surface: "#161618",
        accent: {
          cyan: "#00F2FF",
          purple: "#8A2BE2",
          deepCyan: "#0E7490", // For CV Builder print
        },
        text: {
          primary: "#EDEDED",
          secondary: "#A0A0A0",
        },
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      borderRadius: {
        none: "0",
        sm: "0",
        DEFAULT: "0",
        md: "0",
        lg: "0",
        xl: "0",
        "2xl": "0",
        "3xl": "0",
        full: "9999px",
      },
      boxShadow: {
        'cyan-glow': '0 0 15px rgba(0, 242, 255, 0.3)',
        'purple-glow': '0 0 15px rgba(138, 43, 226, 0.3)',
      },
      keyframes: {
        ripple: {
          '0%': { transform: 'scale(0)', opacity: '0.5' },
          '100%': { transform: 'scale(4)', opacity: '0' },
        }
      },
      animation: {
        ripple: 'ripple 0.5s linear',
      }
    },
  },
  plugins: [],
};
export default config;
