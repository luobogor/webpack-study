const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
    entry: {
        app: './src/index.js'
    },

    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            title: 'Production'
        }),
        // 将所有的入口 chunk(entry chunks)中引用的 *.css，移动到独立分离的 CSS 文件。
        // 因此样式将不再内嵌到 JS bundle 中，而是会放到一个单独的 CSS 文件（即 styles.css）
        new ExtractTextPlugin('[name].css')
        //参数 new ExtractTextPlugin(options: filename | object)
    ],

    module: {
        rules: [
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    // fallback:loader（例如 'style-loader'）应用于当 CSS 没有被提取时候选loader
                    fallback: 'style-loader',
                    // use:loader 被用于将资源转换成一个 CSS 导出模块
                    use: 'css-loader',
                    // publicfile:重写此 loader 的 publicPath 配置
                })

                // ExtractTextPlugin.extract({use: ['css-loader', 'postcss-loader', 'less-loader']})
                // 相当于以下？？
                // ExtractTextPlugin.extract(['css-loader', 'postcss-loader', 'less-loader'])
            }
        ]
    },

    output: {
        filename: "[name].bundle.js",
        path: path.resolve(__dirname, 'dist')
    }
};
