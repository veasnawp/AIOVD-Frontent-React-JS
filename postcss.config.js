// const tailWindCSS = require('tailwindcss');
const purgecss = require('@fullhuman/postcss-purgecss')({
  content: ["./src/**/*.{html,js,ts,tsx}"],

  // Include any special characters you're using in this regular expression
  defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || []
})
module.exports = {
  plugins: [
    'postcss-preset-env',
    require('postcss-import'),
    require('tailwindcss'),
    require('autoprefixer'),
    require('cssnano')({
      preset: 'default'
    }),
    ...[purgecss]
  ]
}