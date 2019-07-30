const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  mode: "production",
  optimization: {
    minimizer: [
      new UglifyJsPlugin({ cache: true, parallel: true, sourceMap: true }),
    ]
  },
  entry: './src/index.js',
  output: {
    filename: 'lit-html-loader.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/dist/',
    library: "lit-html-loader",   // Important
    libraryTarget: 'umd',   // Important
    umdNamedDefine: true   // Important
  },
  target: "node",
  module: {
    rules: [
      {
        test: /\.js$/,
        // exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        },
      },
    ]
  },
  externals: {
    "html-minifier": "html-minifier",
  },
};
