export const baz = ()=> {// 会被 tree-shaking 删除
  console.log('case--baz')
}

export const qux = ()=> {// 会被 tree-shaking 删除，虽然被引用了却没有使用
  console.log('case--qux')
}

export default {
  foo() {
    console.log('case--foo')
  },
  bar() {
    // bar 没有被调用，也没有被删除，是因为如果删除了 bar 会产生副作用，
    // 比如代码中如果动态调用 bar，这些操作是 tree-shaking 检测不到的，所以整个导出的对象都会被保留
    console.log('case--bar')
  }
}
