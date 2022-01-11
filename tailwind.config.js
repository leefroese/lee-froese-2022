module.exports = {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./nuxt.config.{js,ts}",
  ],
  theme: {
    colors: {
      'green': '#00b28d',
      'green-dark': '#009072',
      'gray': '#555351',
      'gray-dark': '#323130',
      'gray-light': '#807d7b',
      'white': '#f0f1f7',
      'black': '#000000'
    },
    fontFamily: {
      sans: ['IBM Plex Sans', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Open Sans', 'Helvetica Neue', 'sans-serif']
    },
    extend: {},
  },
  plugins: [],
}