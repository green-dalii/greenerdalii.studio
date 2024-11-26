const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["SF Pro SC","HanHei SC","SF Pro Text","Myriad Set Pro","SF Pro Icons","Apple Legacy Chevron","PingFang SC","Helvetica Neue","Helvetica","Arial","sans-serif",defaultTheme.fontFamily.sans],
      },
      colors: {
        primary: "var(--color-primary)",
        secondary: "var(--color-secondary)",
      },
      textColor: {
        default: "var(--color-text)",
        offset: "var(--color-text-offset)",
      },
      backgroundColor: {
        default: "var(--color-background)",
        offset: "var(--color-background-offset)",
      },
      borderColor: {
        default: "var(--color-border)",
      },
    },
  },
  variants: {
    backdropFilter: ['responsive', 'hover', 'focus'],
  },
  daisyui: {
    themes: [
      {
        light: {
          primary: "var(--color-primary)",
        },
        dark: {
          "base-100": "var(--color-background)",
        },
      },
    ],
  },
  corePlugins: {
    fontSize: false,
  },
  plugins: [require("tailwindcss-fluid-type"), require("daisyui"), require('@tailwindcss/typography')],
};
