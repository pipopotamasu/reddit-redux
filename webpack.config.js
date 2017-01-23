const path = require('path');
module.exports = {
  entry: {
    app: "./src/js/index.js"
  },

  output: {
    path: __dirname + '/public',
    filename: "js/[name].bundle.js"
  },

  cache: true,

  watch: true,

  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['react','es2015']
        }
      }
    ]
  }
}
