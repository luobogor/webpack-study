module.exports = {
    entry: {
        bundle: './main.jsx',
    },
    output: {
        filename: '[name].js'
    },

    module: {
        rules: [
            {
                //匹配文件名以.jsx或.js结尾的文件
                test: /\.jsx?$/,
                //不搜索node_modules目录
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        //babel-loader需要Babel-preset插件babel-preset-es2015、babel-preset-react
                        presets: ['es2015', 'react']
                    }
                }
            }
        ]
    }
};

// 需要以下依赖
// "webpack": "^3.10.0",
//     "webpack-dev-server": "^2.11.1",
//     "babel-core": "^6.26.0",
//     "babel-loader": "^7.1.2",
//     "babel-preset-es2015": "^6.24.1",
//     "babel-preset-react": "^6.24.1",
//     "react": "15.x",
//     "react-dom": "15.x"

// webpack 1.x 用loaders
// modules: {
//     loaders: {...}
// }

// // webpack 2以上 用rules
// modules: {
//     rules: {...}
// }
