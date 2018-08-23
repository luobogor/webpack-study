var webpack = require('webpack');

module.exports = {
    entry: {
        main: './main.js',
        vendor:['jquery']
    },
    output: {
        filename: 'bundle.js',
    },

    module: {
        rules: [
            { test: /\.(html)$/, use: ["html-loader"] },
        ]
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            filename: 'vendor.js'
        })
    ]
};
