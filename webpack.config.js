const path = require('path')

module.exports = {
  entry: './js/platform.js',

  output: {
    path: path.resolve('dist'),
    filename: 'main.js',
  },
}