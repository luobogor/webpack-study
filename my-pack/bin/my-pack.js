#! /usr/bin/env node
// 上面的语句意思是告诉机器使用 node 执行当前这个文件

const path = require('path')

// todo 为什么这里使用 path.resolve('webpack.config.js')
const config = require(path.resolve('webpack.config.js'))

const Compiler = require('../libs/Compiler')
const compiler = new Compiler(config)
compiler.run()
