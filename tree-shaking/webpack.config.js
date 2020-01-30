const path = require('path')

module.exports = {
  // mode: 'development',
  mode: 'production',
  entry: {
    case1: './src/index.js',
    case2: './src/case2/index.js',
    case3: './src/case3/index.js'
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  watch: true,
  // module: {
  //   rules: [{
  //     test: /\.js$/,
  //     exclude: /node_modules/,
  //     use: {
  //       loader: 'babel-loader',
  //       options: {
  //         presets:[
  //           '@babel/preset-env'
  //         ]
  //       }
  //     },
  //   }]
  // },
};
