import foo from './foo.html';
import $ from 'jquery';

document.body.insertAdjacentHTML('beforeend', foo);
$('#sec2').text('hello webpack');
console.log('execute');
console.dir('foo dir:',foo);
console.log('foo log:',foo); // 为什么 log 无输出？
