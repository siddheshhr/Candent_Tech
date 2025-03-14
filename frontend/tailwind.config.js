const flowbite = require("flowbite-react/tailwind");
/** @type {import('tailwindcss').Config} */


module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", 
    flowbite.content(),
  ],
  theme: {
    extend: {
      colors: {
        candentBlue: '#3B9EC1', // example brand color
      },
    },
  },
  plugins: [
    flowbite.plugin(),
  ],
};
