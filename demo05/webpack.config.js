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
                test: /\.(png|jpg)$/,
                use: {
                    loader: 'url-loader',
                    options: {
                        limit: 8192
                    }
                }
            }
        ]
    }
};
