// 前置 -! 不让文件执行 pre、normal loader
// 前置 ! 不让文件执行 normal loader
// 前置 !! 只执行行内 loader，其他 loader 都不执行
// 后置 ! 执行行内 loader
const b = require('!!inline-loader!./base/b')

module.exports = b + 'a'

// loader 分为 pitch loader、normal loader

// pitch loader 会递归加载依赖项，见 style-loader，而普通 loader 不会，把 style-loader 的 pitch 去掉可以进行测试
