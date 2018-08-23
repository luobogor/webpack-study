import pageA from './pageA';
var $ = require('jquery');

console.log($.extend({}, { a: 1 }));
console.log('main2.js pageA', pageA);
