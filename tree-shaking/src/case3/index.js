let cc = ''
if (Math.random() > 0.5) {
  // 除非用了 webpack 提供的动态加载，否则下面的 require 看起来是动态加载实际上是打包的时候 a、b 两个文件都已经打包进去
  cc = require('./a')
} else {
  cc = require('./b')
}

console.log('case3-----------:', cc)
