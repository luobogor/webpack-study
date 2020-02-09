const path = require('path')
const webpack = require('webpack')

class TestPlugin1 {
  apply(compiler) {
    compiler.hooks.emit.tap('emit', () => {
      console.log('emit')
    })
  }
}

class TestPlugin2 {
  apply(compiler) {
    compiler.hooks.afterPlugins.tap('afterPlugins', () => {
      console.log('afterPlugins')
    })
  }
}

module.exports = {
  entry: {
    index1: './src/index.js',
    index2: './src/index2.js',
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    loaders: [{
      test: /\.(png|jpg)$/,
      loaders: ['url-loader', path.resolve(__dirname, './loaders/my-url-loader')],
    }]
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin("init.js")
  ]
};
