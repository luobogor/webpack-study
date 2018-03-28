var webpack = require('webpack');

module.exports = {
    entry: {
        bundle: './main.js',
    },

    output: {
        filename: '[name].js'
    },

    plugins: [
        new webpack.ProvidePlugin({
            $:'jquery'
        })
    ]
};