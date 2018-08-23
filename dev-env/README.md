NamedModulesPlugin，以便更容易查看要修补(patch)的依赖??

webpack.HotModuleReplacementPlugin热更新

WDS webpack-dev-server

webpack 2 支持原生的 ES6 模块语法，意味着你可以无须额外引入 babel 这样的工具，就可以使用 import 和 export。但是注意，如果使用其他的 ES6+ 特性，仍然需要引入 babel。



# 热更新原理
https://zhuanlan.zhihu.com/p/30669007
https://webpack.docschina.org/concepts/hot-module-replacement
https://zhuanlan.zhihu.com/p/30623057
https://www.cnblogs.com/vajoy/p/7000522.html

如果不使用HotModuleReplacementPlugin，可以设置 devServer.hot 为 true 后，并且在package.json 文件中添加如下的 script 脚本：

"start": "webpack-dev-server --hot --open"

添加 —hot 配置项后，devServer 会告诉 webpack 自动引入 HotModuleReplacementPlugin 插件，而不用我们再手动引入了。

## 流程
entry 添加了一段代码
webpack-dev-server 修改了webpack 配置中的 entry 属性，在里面添加了 webpack-dev-client 的代码，这样在最后的 bundle.js 文件中就会有接收 websocket 消息的代码了

dev-middle 调用 webpack watch
 
从当前更新模块向上冒泡

## Question
- manifest https://webpack.docschina.org/concepts/manifest/

与 dev-middle-wire hot-midware的关系
