const path = require('path');

module.exports = {
  mode: 'production',
  context: __dirname,
  entry: './frontend/slack-clone.jsx',
  output: {
    path: path.resolve(__dirname, 'app', 'assets', 'javascripts'),
    filename: 'bundle.js'
  },
  resolve: {
    extensions: ['.js', '.jsx', '*']
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/env', '@babel/react']
          },
        },
      },
      {
        test: /\.jpeg?$/,
        use: 'url-loader'
      },
      {
        test: /\.css$/,
        use: {
          loader: 'css-loader',
          options: {
            url: false
          }
        }
      }
    ]
  },
  devtool: 'source-map'
};