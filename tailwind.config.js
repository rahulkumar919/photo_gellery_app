/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        base: "#E0E5EC",
        ink: "#2B3040",
        muted: "#5A6275",
        accent: "#D64550",
        focus: "#3B5BDB",
      },
      boxShadow: {
        // Neumorphic shadow pairs: light highlight top-left, dark shadow bottom-right
        "raised-lg": "9px 9px 18px #A3B1C6, -9px -9px 18px #FFFFFF",
        "raised-sm": "5px 5px 10px #A3B1C6, -5px -5px 10px #FFFFFF",
        "inset-md":
          "inset 5px 5px 10px #A3B1C6, inset -5px -5px 10px #FFFFFF",
        "inset-sm": "inset 3px 3px 6px #A3B1C6, inset -3px -3px 6px #FFFFFF",
        // Reduced shadow values for mobile so cards don't look heavy on small screens
        "raised-lg-mobile": "5px 5px 10px #A3B1C6, -5px -5px 10px #FFFFFF",
        "raised-sm-mobile": "3px 3px 6px #A3B1C6, -3px -3px 6px #FFFFFF",
        "inset-md-mobile":
          "inset 3px 3px 6px #A3B1C6, inset -3px -3px 6px #FFFFFF",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "-apple-system", '"Segoe UI"', "sans-serif"],
      },
      fontSize: {
        // clamp-based responsive title (applied via inline style, not a utility)
        title: "clamp(2.25rem, 5vw, 3.75rem)",
      },
    },
  },
  plugins: [],
};
