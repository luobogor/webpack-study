- Babel polyfill 与 Babel Runtime Transform 的区别
功能一样都是转译 ES6 的 API。 Map、Set、Array.from 等等
Babel polyfill 为应该而准备的，全局垫片，污染全局。 --save 安装 。 例如 Set 全局命名就是 Set
Babel Runtime Transform 为开发框架而准备的，局部垫片，不会污染全局。还会为共同引用做优化。 --save -dev 安装 。 例如 Set 全局命名为 _Set，这样不会污染全局的Set


TODO https://juejin.im/entry/57cfc4e4816dfa005422c770
单个 entry 的配置，是无法提取公共 chunk的，所以入口要是多个。
Demo13 实验结果，当名为commons时，不会提取模块的公共引用，当名为vender时，会将共同引用和第三方库打包到vender.js
````
  entry: {
        bundle: './main.js',
        vendor: ['jquery']
    },
 plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            // 把入口文件里面的vendor数组打包成verdors.js
            name: 'vendor',
            filename: 'vendor.js'
        })
    ]
````
