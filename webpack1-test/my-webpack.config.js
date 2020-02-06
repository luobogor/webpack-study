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
    rules: [{
      test: /\.less$/,
      use: [
        path.resolve(__dirname, 'loaders', 'style-loader'),
        path.resolve(__dirname, 'loaders', 'less-loader'),
      ]
    }]
  },
  plugins: [
    new TestPlugin1(),
    new TestPlugin2(),
  ]
};
