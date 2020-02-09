#! /usr/bin/env node
// 上面的语句意思是告诉机器使用 node 执行当前这个文件

const path = require('path')
const options = require(path.resolve('webpack.config.js'))

const webpack = require('./lib/webpack1');

(function webpackCli() {
  if (!options.context) {
    options.context = process.cwd();
  }
})()

webpack(options, function (err, stats) {
  console.log('webpack done....')
})

