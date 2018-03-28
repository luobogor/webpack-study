// require.ensure tells Webpack that ./a.js should be separated from bundle.js and built into a single chunk file.
// ensure第一个参数dependencies：字符串构成的数组，声明 callback 回调函数中所需的所有模块。
require.ensure(['./a'], function (require) {
    var content = require('./a');
    document.open();
    document.write('<h1>'+content+'</h1>');
    document.close();
});