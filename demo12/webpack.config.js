var webpack = require('webpack');

module.exports = {
    entry: {
        bundle1: './main1.jsx',
        bundle2: './main2.jsx'
    },

    output: {
        filename: '[name].js'
    },

    module: {

        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['es2015', 'react']
                    }
                }
            }
        ]
    },


    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            name: 'commons',
            // 如果filename与chunkname相同，filename可以省略不写
            filename: 'commons.js'
        })
    ]
};