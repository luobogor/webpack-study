const webpack = require('webpack');
const merge = require('webpack-merge');
const UglifyJSPlugin =  require('uglifyjs-webpack-plugin');
const common = require('./webpack.commom.js');

module.exports = merge(common, {
    // 鼓励在生产环境中启用 source map，因为它们对调试源码(debug)和运行基准测试(benchmark tests)很有帮助
    // 避免在生产中使用 inline-*** 和 eval-***，因为它们可以增加 bundle 大小，并降低整体性能。
    devtool:'source-map',
    plugins:[
        new UglifyJSPlugin({
            sourceMap:true
        }),
        new webpack.DefinePlugin({
            // 许多 library 将通过与 process.env.NODE_ENV 环境变量关联，以决定 library 中应该引用哪些内容。例如，当不处于生产环境中时，某些 library 为了使调试变得容
            // 如果你正在使用像 react 这样的 library，那么在添加此 DefinePlugin 插件后，你应该看到 bundle 大小显著下降。
            'process.env.NODE_ENV':JSON.stringify('production')
        })
    ]
});