export function TestFunC() {}

// TestFunC.prototype.render = function() {
//   return "CCCCC------";
// }

// 只要这个文件有东西被 import 并且使用了，那么这个文件的所有语句都会被保留，因为不保留可能会有副作用
window.showHello = function() {
  console.log('window.hello......')
}
Array.prototype.show = function () {
  console.log('Array.prototype.show.....')
}
