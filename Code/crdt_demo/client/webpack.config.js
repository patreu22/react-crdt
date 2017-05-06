// webpack.config.js:

var path = require('path');
var webpack = require('webpack');


module.exports = {
  resolve: {
    extensions: ['*', '.js', '.jsx']
  },
  entry:  [
    path.resolve(__dirname, 'src/index.js')
  ],
  output: {
    path: path.resolve(__dirname, 'public/js'),
    filename: 'bundle.js',
    publicPath: 'public/'
  },
  devtool: 'source-map',
  module: {
    loaders: [
        {
          test: /\.jsx?$/,
          exclude: /(node_modules| bower_components)/,
          loader: 'babel-loader',
          query: {
            presets: ['react', 'es2015', 'stage-0'],
            plugins: ['transform-class-properties', 'transform-decorators-legacy'],
          }
        },
        {
          test: /\.css$/,
          loader: 'css-loader'
        }
    ],
  }
}
