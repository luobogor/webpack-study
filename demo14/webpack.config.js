module.exports = {
    entry: './main.js',
    output: {
        filename: 'bundle.js'
    },
    externals:{
        HelloData:'data'
    }
};