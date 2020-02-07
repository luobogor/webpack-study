// 前置 -! 不让文件执行 pre、normal loader
// 前置 ! 不让文件执行 normal loader
// 前置 !! 只执行行内 loader，其他 loader 都不执行
// 后置 ! 执行行内 loader
// const b = require('!!inline-loader!./base/b')

module.exports = 'a'

// loader 分为 pitch loader、normal loader
