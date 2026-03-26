/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        bg:       "#09090f",
        surface:  "#12121e",
        surface2: "#1a1a2e",
        border:   "#ffffff12",
        accent:   "#6c63ff",
        accent2:  "#ff6b9d",
        accent3:  "#00d4aa",
        textP:    "#f0f0ff",
        textS:    "#8888aa",
      },
      fontFamily: {
        display: ["Syne-Bold"],
        body:    ["DMSans-Regular"],
        bodyMed: ["DMSans-Medium"],
        mono:    ["SpaceMono"],
      },
    },
  },
  plugins: [],
};
