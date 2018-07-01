import printMeC from './c';
// 如果当前模块发生变化，从当前模块开始更新，如果在这里放了module.hot.accept就会停止向上冒泡，index模块是不会更新的。
// 否则向上冒泡触发index.js的accept方法
// module.hot.accept((error)=> {
//
// });
export default function printMe() {
    console.log('I am print');
    console.log('bbq');
    printMeC();
};
