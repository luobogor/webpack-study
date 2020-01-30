import { TestFunC } from './b'
// import 进来不使用也会被删掉
import fun,{ hello, deadVarTest, TestClass1, TestFunB } from './a'
// import { split } from 'lodash-es'
import _ from 'lodash-es'

// 死变量相关引用的代码会被删除
const deadVar = deadVarTest()
console.log('index-------:', fun.foo())
// console.log('dddd:', [].show())
// console.log(split('a.b.c', '.'))
console.log(_.split('a.b.c', '.'))
// console.log('index-------:', hello())
const b = new TestFunB()
const c = new TestFunC()
console.log('b.render-----:', b.render())
console.log('c.render-----:', c.render())
console.log('array.render-----:', [].render())
