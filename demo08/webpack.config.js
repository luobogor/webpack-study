var HtmlWebpackPlugin = require('html-webpack-plugin');
var OpenBroswerPlugin = require('open-browser-webpack-plugin');

module.exports = {
    entry: './main.js',
    output: {
        filename: 'bundle.js'
    },
    plugins:[
        new HtmlWebpackPlugin({
            title:'Webpack-demos',
            filename:'index.html'
        }),
        new OpenBroswerPlugin({
            url:'http://localhost:8080'
        })
    ]
};
