// 不会被删掉
const zoo = () => {
  console.log('zoo----------')
}

// 会被删掉
export function hello() {
  console.log('hello----------')
}

export function deadVarTest() {
  return 'deadVarTest----------'
}

export class TestClass1 {
  show() {
    console.log('TestClass1----show')
  }
}

export function TestFunB() {}

TestFunB.prototype.render = function() {
  return "BBBB";
}

Array.prototype.render = function() {
  return "Array.prototype.render";
}
window.showHello2 = function() {
  console.log('hello2......')
}

export default {
  // 即使代码没被调用也不会被删掉
  // 因为可能存在副作用，比如开发者遍历这个对象的长度作一些判断逻辑，删除了代码就会出问题
  bar() {
    console.log('--------bar')
  },
  foo() {
    console.log('------foo')
    if (true) {
      console.log('foo-----true')
    } else {// 这个永远不会被执行的 else 会被干掉
      console.log('foo-----false')
    }

    return 'hahaahahahah'

    console.log('这个在return后面的永远不会的执行的也会被干掉')
  }
}
