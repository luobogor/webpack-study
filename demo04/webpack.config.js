module.exports = {
    entry: {
        bundle: './main.js',
    },
    output: {
        filename: './[name].js'
    },

    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            }
        ]
    }
};
