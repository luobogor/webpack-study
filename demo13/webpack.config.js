var webpack = require('webpack');

module.exports = {
    entry: {
        bundle1: './main.js',
        bundle2: './main2.js',
        // vendor: ['jquery']
    },

    output: {
        filename: '[name].js'
    },

    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            // 把入口文件里面的vendor数组打包成verdors.js
            // (公共 chunk(commnon chunk) 的名称)
            name: 'common',
            // (公共chunk 的文件名)
            filename: 'common.js'
        })
    ]


    // plugins: [
    //     new webpack.optimize.CommonsChunkPlugin({
    //         // 把入口文件里面的vendor数组打包成verdors.js
    //         // (公共 chunk(commnon chunk) 的名称)
    //         name: 'vendor',
    //         // (公共chunk 的文件名)
    //         filename: 'vendor.js'
    //     })
    // ]
};
