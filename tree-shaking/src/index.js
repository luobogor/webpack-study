import case1 from './case1'
import case2 from './case2'
import './case3'

case1.foo()
case2.foo()

// 导入第三方库 tree-shaking 注意事项
// **** 不可以 tree-shaking ***
// import _es from 'lodash-es'
// import _es from 'lodash'
// import { last } from 'lodash'

// **** 可以 tree-shaking ***
// import { last } from 'lodash-es'
// import last from 'lodash-es/last'
// import last from 'lodash/last'

/*** 可以用 commonJS 引入 es module，但这种写法无法 tree-shaking */
// 因为
// 1. commonJS 无法做静态分析
// 2. module.exports 本身就是导出一整个对象

// import _ from './case4'
// import { last } from './case4'

/*** 可以用 commonJS 引入 es module，但这种写法无法 tree-shaking，因为 commonJS 无法做静态导入分析 */
// const _ = require('./case5').default
// const toUpperCase = require('./case5').toUpperCase
