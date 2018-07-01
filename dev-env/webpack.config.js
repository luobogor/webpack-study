const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const webpack = require('webpack');

module.exports = {
    entry: {
        app: './src/index.js'
    },
    devtool: 'inline-source-map',

    devServer: {
        contentBase: './dist',
        hot: true,
        host: 'localhost'
    },

    module: {
        rules: [
            {
                // 借助于 style-loader 的帮助，CSS 的模块热替换实际上是相当简单的。
                // 当更新 CSS 依赖模块时，此 loader 在后台使用 module.hot.accept 来修补(patch) <style> 标签。
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            }
        ]
    },

    plugins: [
        new CleanWebpackPlugin(['dist']),
        new HtmlWebpackPlugin({
            title: 'Hot Module Replacement'
        }),
        // 当开启 HMR 的时候使用NamedModulesPlugin插件会显示更新模块的相对路径，建议用于开发环境。
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin()
    ],
    output: {
        filename: '[name].bundle.js',
        //webpack要求输入路径必须是绝对路径
        path: path.resolve(__dirname, 'dist')
    }
};
