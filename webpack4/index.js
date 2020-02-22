#! /usr/bin/env node

const path = require('path')
const options = require(path.resolve('webpack.config.js'))

const webpack = require('./lib/webpack');

webpack(options, function (err, stats) {
  console.log('撒花结局用时:', (stats.endTime - stats.startTime) / 1000, 's')
})

