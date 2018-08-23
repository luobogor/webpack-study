var webpack = require('webpack');

module.exports = {
    entry: {
        bundle: './main.js',
        vendor: ['jquery']
    },

    output: {
        filename: '[name].js'
    },
};
