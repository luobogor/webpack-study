import printMe from './print.js';
import './style.css';

// 参考 https://webpack.docschina.org/guides/hot-module-replacement/#-hmr
function component() {
    var element = document.createElement('div');
    var btn = document.createElement('button');

    element.innerHTML = 'Hello World';

    btn.innerHTML = 'Click me and check the console!';
    btn.onclick = printMe;  // onclick event is bind to the original printMe function

    element.appendChild(btn);

    return element;
}

// 当 print.js 改变导致页面重新渲染时，重新获取渲染的元素
let element = component();
document.body.appendChild(element);

if (module.hot) {
    // 当 print.js 内部(甚至print.js依赖的模块)发生变更时, 告诉webpack当前模块接受更新
    // 如果更新冒泡到入口文件(即当前模块)，都没有检测到调用过accept的模块，则刷新页面，不启用HMR
    module.hot.accept('./print.js', () => {
        console.log('Accepting the updated printMe module!');
        document.body.removeChild(element);
        // 重新渲染页面后，component 更新 click 事件处理
        element = component();
        document.body.appendChild(element);
    });
}
