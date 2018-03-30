const merge = require('webpack-merge');
const common = require('./webpack.commom.js');

module.exports = merge(common, {
    devtool:'inline-source-map',
    devServer:{
        contentBase:'./dist'
    }
});