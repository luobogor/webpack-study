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
  mode: 'none',
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  resolveLoader: {
    modules: ['node_modules', path.resolve(__dirname, 'loaders')]
    // 另一种方式使用别名 alias: {}
  },
  module: {
    // pre + normal + inline + post
    rules: [{
      test: /\.less$/,
      use: [
        path.resolve(__dirname, 'loaders', 'style-loader'),
        path.resolve(__dirname, 'loaders', 'less-loader'),
      ]
    }, {
      test: /\.js$/,
      use: {
        loader: 'test-loader1'
      },
      enforce: 'pre'
    }, {
      test: /\.js$/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: [
            '@babel/preset-env'
          ],
        }
      },
      enforce: 'pre'
    }, {
      test: /\.js$/,
      use: {
        loader: 'test-loader2'
      }
    }, {
      test: /\.js$/,
      use: {
        loader: 'test-loader3'
      },
    }, {
      test: /\.js$/,
      use: {
        loader: 'test-loader4'
      },
      enforce: 'post'
    }]
  },
  devtool: 'source-map',
  plugins: [
    new TestPlugin1(),
    new TestPlugin2(),
  ]
};
