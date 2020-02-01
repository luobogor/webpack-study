const path = require('path')

module.exports = {
  // mode: 'development',
  mode: 'production',
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
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
