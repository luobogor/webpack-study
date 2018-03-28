var webpack = require('webpack');
var uglifyjsWebpackPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  entry: './main.js',
  output: {
    path:__dirname,
    filename: 'bundle.js'
  },
  // plugins:[
  //     new uglifyjsWebpackPlugin()
  // ]
};
