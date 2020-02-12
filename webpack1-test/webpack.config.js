const path = require('path')

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
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    loaders: [{
      test: /\.(png|jpg)$/,
      loader: 'url-loader',
      query: {
        limit: 8192
      }
    }, {
      test: /\.less$/,
      loaders: [
        path.resolve(__dirname, 'loaders', 'style-loader'),
        path.resolve(__dirname, 'loaders', 'css-loader'),
        path.resolve(__dirname, 'loaders', 'less-loader'),
      ]
    }],
  },
};
