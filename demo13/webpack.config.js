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
            name: 'vendor',
            filename: 'vendor.js'
        })
    ]
};