import case1,{ qux } from './case1'
import case2 from './case2'
import './case3'

case1.foo()
case2.foo()

// 导入第三方库 tree-shaking 注意事项
// **** 不可以 tree-shaking ***
// import _es from 'lodash-es'
// import _ from 'lodash'
// 因为 lodash 本身并不是 esmodule，不支持 tree-shaking
// import { last } from 'lodash'

// **** 可以 tree-shaking ***
// import { last } from 'lodash-es'
// import last from 'lodash-es/last'
// import last from 'lodash/last'

/*** 可以用 commonJS 引入 es module，但无法 tree-shaking */
// 因为
// 1. commonJS 无法做静态分析
// 2. module.exports 本身就是导出一整个对象

import _case4 from './case4'
// import { last } from './case4'

/*** 可以用 commonJS 引入 es module，但无法 tree-shaking，因为 commonJS 无法做静态导入分析 */
const _case5 = require('./case5').default
// const toUpperCase = require('./case5').toUpperCase

// 总结来说就是 es module 与  CommonJS 混用是无法 tree-shaking
