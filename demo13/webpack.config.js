var webpack = require('webpack');

module.exports = {
    entry: {
        bundle: './main.js',
        vendor: ['jquery']
    },

    output: {
        filename: '[name].js'
    },

    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            // 把入口文件里面的vendor数组打包成verdors.js
            name: 'vendor',
            filename: 'vendor.js'
        })
    ]
};
