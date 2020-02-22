const path = require('path')
// const FileListPlugin = require('./plugins/FileListPlugin')

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
  // module: {
  //   // pre + normal + inline + post
  //   rules: [{
  //     test: /\.less$/,
  //     use: [
  //       'style-loader',
  //       'css-loader',
  //       'less-loader',
  //     ]
  //   }, {
  //     test: /\.js$/,
  //     use: {
  //       loader: 'test-loader1'
  //     },
  //     enforce: 'pre'
  //   }, {
  //     test: /\.js$/,
  //     use: {
  //       loader: 'test-loader2'
  //     }
  //   }, {
  //     test: /\.(png|jpg)$/,
  //     use: {
  //       loader: 'url-loader',
  //       options: {
  //         limit: 8192
  //       }
  //     }
  //   }, {
  //     test: /\.js$/,
  //     use: {
  //       loader: 'banner-loader',
  //       options: {
  //         text: '火力少年王',
  //         filename: path.resolve(__dirname, 'banner.txt'),
  //       },
  //     },
  //   }, {
  //     test: /\.js$/,
  //     use: {
  //       loader: 'test-loader3'
  //     },
  //   }, {
  //     test: /\.js$/,
  //     use: {
  //       loader: 'test-loader4'
  //     },
  //     enforce: 'post'
  //   }]
  // },
  // plugins: [
  //   new TestPlugin1(),
  //   new TestPlugin2(),
  //   new FileListPlugin({
  //       filename: 'list.md'
  //   })
  // ]
};
