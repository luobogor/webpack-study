(function (modules) { // webpackBootstrap，webpack的启动函数
var installedModules = {};
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
    
    "./src/index.js":
    (function (module, exports, __webpack_require__) {
        eval(`__webpack_require__("./src/index.less");

const a = __webpack_require__("./src/a.js");

console.log('index:', a);`);
    }),
    
    "./src/index.less":
    (function (module, exports, __webpack_require__) {
        eval(`const style = document.createElement('style');
style.innerHTML = "body {\\n  background: lightsalmon;\\n}\\n";
document.head.appendChild(style);`);
    }),
    
    "./src/a.js":
    (function (module, exports, __webpack_require__) {
        eval(`const b = __webpack_require__("./src/base/b.js");

module.exports = b + 'a';`);
    }),
    
    "./src/base/b.js":
    (function (module, exports, __webpack_require__) {
        eval(`module.exports = 'hello_b';`);
    }),
    
});
