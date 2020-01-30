# 深入浅出 tree-shaking

维奇历史及原理介绍
https://en.wikipedia.org/wiki/Tree_shaking 

Dead code elimination
tree shaking只能在静态modules下工作
动态执行代码是不会检测删除的，比如IIFE，因为有副作用

"sideEffects": false 来告知 webpack，它可以安全地删除未用到的 export
经测试设置成 true 似乎没用，修改 node_modules 的库这个选项会影响 tree-shaking，有用的

package.json 的 module 字段也是有用的。

```
// 会 tree-shaking
import { map } from 'lodash-es'
// 不会 tree-shking，因为这种写法有副作用
import _ from 'lodash-es'
```



Webpack Tree shaking会对多层调用的模块进行重构
```
//App.js
import { getEntry } from './utils'
console.log(getEntry());

//utils.js
import entry1 from './entry.js'
export function getEntry() {
  return entry1();
}

//entry.js
export default function entry1() {
  return 'entry1'
}
复制代码result: 简化后的代码如下
//摘录核心代码
function(e, t, r) {
  "use strict";
  r.r(t), console.log("entry1")
}
```


"这是 ES6 modules 在设计时的一个重要考量，也是为什么没有直接采用 CommonJS，正是基于这个基础上，才使得 tree-shaking 成为可能，这也是为什么 rollup 和 webpack 2 都要用 ES6 module syntax 才能 tree-shaking。"
这是真的吗？？好像有道理

```
这些设计虽然使得灵活性不如 CommonJS 的 require，但却保证了 ES6 modules 的依赖关系是确定 (deterministic) 的，和运行时的状态无关，从而也就保证了 ES6 modules 是可以进行可靠的静态分析的。对于主要在服务端运行的 Node 来说，所有的代码都在本地，按需动态 require 即可，但对于要下发到客户端的 web 代码而言，要做到高效的按需使用，不能等到代码执行了才知道模块的依赖，必须要从模块的静态分析入手。这是 ES6 modules 在设计时的一个重要考量，也是为什么没有直接采用 CommonJS。

作者：尤雨溪
链接：https://www.zhihu.com/question/41922432/answer/93346223
来源：知乎
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。
```

## 大纲
- 历史
- 副作用
- package.json esm
- 总结用法

工时 12，今天 6

9：30 - 11:30 2
12:00-13:00 1
14:00-17:00 3

