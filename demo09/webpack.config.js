var webpack = require('webpack');

var devFlagPlugin = new webpack.DefinePlugin({
    // DefinePlugin 允许创建一个在编译时可以配置的全局常量
    __DEV__: JSON.stringify(JSON.parse(process.env.DEBUG || 'false'))
});

module.exports = {
    entry: './main.js',
    output: {
        filename: 'bundle.js'
    }
};