/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        jornada: {
          navy: "#172A3A",
          terracotta: "#C45D3C",
          ivory: "#F6F2E9",
          green: "#356859",
          red: "#B54747",
          muted: "#5C6B73",
          border: "#E2DACD",
          surface: "#FFFFFF",
          "surface-alt": "#EFEADF"
        }
      },
      fontFamily: {
        heading: ["var(--font-archivo)", "sans-serif"],
        body: ["var(--font-source-sans)", "sans-serif"]
      }
    },
  },
  plugins: [],
};
