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
          // query: { 
            // presets: ['@babel/env', '@babel/react']
          options: {
            presets: [
              '@babel/preset-env',
              ['@babel/preset-react', { runtime: 'classic' }]
            ]
          },
        },
      },
      {
        // test: /\.jpeg?$/,
        test: /\.jpe?g$/, // matches jpg and jpeg
        use: 'url-loader'
      },
      {
        test: /\.css$/,
        // use: {
        //   loader: 'css-loader',
        //   options: {
        //     url: false
        //   }
        use: ['style-loader', 'css-loader'] // adds style-loader to inject css into DOM
      }
    ]
  },
  devtool: 'source-map'
};