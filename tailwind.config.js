/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");
module.exports = {
  content: ["./src/**/*.{html,js,ts,tsx}"],
  theme: {
    extend: {
      screens: {
        "2xl": { max: "1535px" },
        xl: { max: "1279px" },
        "1145": { max: "1145px" },
        lg: { max: "999.98px" },
        md: { max: "767px" },
        smd: { max: "640px" },
        sm: { max: "480px" },
        ssm: { max: "360px" },
        m2xl: { min: "1536px" },
        mxl: { min: "1280px" },
        mlg: { min: "999.99px" },
        mmd: { min: "768px" },
        msm: { min: "481px" },
        mssm: { max: "360px" },
        xl2xl: { min: "1280px", max: "1535px" },
        lgxl: { min: "999.99px", max: "1279px" },
        mdlg: { min: "768px", max: "999.98px" },
        smlg: { min: "481px", max: "999.98px" },
        smmd: { min: "481px", max: "767px" },
      },
      colors:{
        transparent: "transparent",
        current: "currentColor",
      },
      keyframes: {
        shine: { to: { left: "125%" } },
      },
      animation: {
        shine: "shine 1s",
      },
    },
  },
  // prefix: 'vact-',
  plugins: [],
};
