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
        background: "var(--background)",
        foreground: "var(--foreground)",
        offside: {
          green: '#5EE85C',
          'green-dark': '#3cc23a',
          navy: '#0b1220',
          dark: '#0a0f1c',
          card: '#121a2b',
          muted: '#8b9bb4',
        }
      },
      boxShadow: {
        'glow': '0 0 30px rgba(94,232,92,0.25)',
        'glow-strong': '0 0 45px rgba(94,232,92,0.4)',
      },
      backgroundImage: {
        'green-radial': 'radial-gradient(600px circle at 50% -10%, rgba(94,232,92,0.15), transparent 80%)',
      }
    },
  },
  plugins: [],
};
export default config;
