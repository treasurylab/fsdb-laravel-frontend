/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        "fs-red": "#B61F24",
        "fs-yellow": "#E7A423",
        "fs-green": "#0B8241",
        "fs-gray": "#808285",
        "fs-white": "#FFFFFF",
        primary: "#FFFFFF",
        background: "#F6F8FC",
        accent: "#FFFFFF",
        "accent-2": "#FFFFFF",
        "text-primary": "#494F58",
        "text-secondary": "#545D67",
        "text-focused": "#5998DB",
        "background-focused": "#EFF7FE",
      },
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
        inter: ["Inter", "sans-serif"],
      },
      screens: {
        tablet: "640px",
        // => @media (min-width: 640px) { ... }

        laptop: "1024px",
        // => @media (min-width: 1024px) { ... }

        desktop: "1200px",
        // => @media (min-width: 1280px) { ... }
      },
    },
  },
  plugins: [],
};
