const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.commom.js');

module.exports = merge(common, {
    devtool:'inline-source-map',
    devServer:{
        contentBase:'./dist',
        //默认端口是8080
        port:3002
    },
    plugins:[
        new webpack.DefinePlugin({
            'process.env.NODE_ENV':JSON.stringify('dev')
            // 也可以在命令脚本这么写NODE_ENV=dev
        })
    ]
});