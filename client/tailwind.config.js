/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#FE5F00",
        textBase: "#202020",
        buttonGrayBg: "#FAFAFA",
        bgCartProduct: "#FFF7EE",
        textCartProduct: "#5c6370",
        textLogo: "#7B7B7B",
        bgwhite50: "rgba(255,255,255,0.9)",
        shadowcategories:"rgba(6, 5, 50, 0.1) 0px_4px_30px"
      },
    },
  },
  plugins: [],
};
