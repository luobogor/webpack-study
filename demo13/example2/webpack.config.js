var webpack = require('webpack');

module.exports = {
    entry: {
        bundle: './main.js',
    },

    output: {
        filename: '[name].js'
    },

    plugins: [
        // 使jquery变为全局变量
        new webpack.ProvidePlugin({
            $:'jquery'
        })
    ]
};
