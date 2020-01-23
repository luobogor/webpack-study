// https://imweb.io/topic/5baca58079ddc80f36592f1a
// https://juejin.im/post/5d36faa9e51d45109725ff55#heading-23
// https://juejin.im/post/5d36faa9e51d45109725ff55#heading-23
// https://github.com/jerryOnlyZRJ/webpack-loader

const { SyncHook } = require("tapable");
let queue = new SyncHook(['name1',['name2']]); //所有的构造函数都接收一个可选的参数，这个参数是一个字符串的数组。

// 订阅
queue.tap('1', function (name, name2) {// tap 的第一个参数是用来标识订阅的函数的
  console.log(name, name2, 1);
  return '1'
});
queue.tap('2', function (name) {
  console.log(name, 2);
});
queue.tap('3', function (name) {
  console.log(name, 3);
});

// 发布
queue.call('webpack', 'webpack-cli');// 发布的时候触发订阅的函数 同时传入参数

// 执行结果:
/*
webpack undefined 1 // 传入的参数需要和new实例的时候保持一致，否则获取不到多传的参数
webpack 2
webpack 3
*/
