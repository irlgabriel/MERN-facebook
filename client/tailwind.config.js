/** @type {import('tailwindcss').Config} */
const plugin = require('tailwindcss/plugin');

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "node_modules/flowbite-react/lib/esm/**/*.js",
  ],
  theme: {
    extend: {},
  },
  plugins: [require("flowbite/plugin"),
    plugin(function({ addUtilities }) {
      addUtilities({
        '.bg-fallback': {
          backgroundImage: "url('https://picsum.photos/300/200')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        },
      });
    })
  ],
};

