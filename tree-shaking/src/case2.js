const baz = ()=> {
  window.sayHello = ()=> {
    console.log('window---hello')
  }
  return 'case--baz'
}

export default {
  foo() {
    const deadVar = baz()// 除了有副作用的 window.sayHello, baz 其他代码都会被删除，因为 baz 执行结果只影响到列变量

    console.log('case2--foo')
    if (false) { // 不可达代码会被删除
      console.log('case2--foo--false')
    }
    return 'return-case2-foo'
    return '123456'// 不可达代码会被删除
  },
  bar() {
    console.log('case2--bar')
  }
}
