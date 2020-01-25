// 这是个立即执行函数表达式，你直接RunCode一下的！（这个文件删掉了一些无用的代码，因为咩有这些代码程序依旧能运行）
(function (modules) { // webpackBootstrap，webpack的启动函数
// The module cache 这表示先定义一个缓存，如果一个模块加载完了，那就不需要再次加载模块了，之后拿模块，在缓存里边直接拿就好了！
  var installedModules = {};

// key  -> "./src/index.js"，value -> {}

// The require function 配置了一个或者说是实现了一个require方法，毕竟require是不能在浏览器里边运行的！
// 找到这个方法是什么时候被调用的
  function __webpack_require__(moduleId) {  //"./src/index.js"

// Check if module is in cache
    if (installedModules[moduleId]) {  //不在缓存中，如果在缓存中就直接返回
      return installedModules[moduleId].exports;

    }
// Create a new module (and put it into the cache)
    var module = installedModules[moduleId] = {
      i: moduleId,
      l: false,
      exports: {}
    };

// Execute the module function
// 找到"./src/index.js"这个key然后执行这个key对应的value值
// 当前模块的exports，即为空对象{}；{i:,l:,exports:,};空对象{};callback
    console.log('1', module.exports) //有两个模块，即入口模块index.js和依赖的a.js，所以这个log打印了两次，即require函数执行了两次
    modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

// Flag the module as loaded
    module.l = true;

// Return the exports of the module
    return module.exports;

  }

// Load entry module and return exports
// 入口模块
  return __webpack_require__(__webpack_require__.s = "./src/index.js");

})
/************************************************************************/
({

  "./src/a.js": //key -> 模块的路径，而每个文件即是一个模块

    (function (module, exports) { //value 是个匿名函数

// 第一次执行了index.js对应的模块的代码，遇到require了，于是又去执行webpack自己实现的require，即__webpack_require__
// 而这个__webpack_require__的返回值正是「'我是模块a'」值，也就是说「let str = '我是模块a'」
      eval("module.exports = '我是模块a'\n\n//# sourceURL=webpack:///./src/a.js?");


    }),

  "./src/index.js":
    (function (module, exports, __webpack_require__) {
// 我们在index.js，即入口文件里边写的require，而传给require的参数，即路径其实是这个a.js模块文件的id
// a.js导出的东西就是require的返回值，即在这里是一个字符串，本来默认是空对象的！
      eval("let str = __webpack_require__(/*! ./a.js */ \"./src/a.js\")\nconsole.log(str)\n\n//# sourceURL=webpack:///./src/index.js?");


    })

});
