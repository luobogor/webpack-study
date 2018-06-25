module.exports = {
    entry: {
        bundle1: './main1.js',
        bundle2: './main2.js'
    },
    output: {
        //使用占位符(substitutions)确保出口文件唯一
        //[name]表示入口文件对象的属性如 bundle1对应./main1.js
        filename: '[name].js'
    }
};
