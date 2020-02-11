#! /usr/bin/env node
// 上面的语句意思是告诉机器使用 node 执行当前这个文件

const path = require('path')
const options = require(path.resolve('webpack.config.js'))

const webpack = require('./lib/webpack1');

webpack(options, function (err, stats) {
  console.log('撒花结局用时:', (stats.endTime - stats.startTime) / 1000, 's')
})

