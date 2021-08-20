const path = require('path');

const clientConfig = {
    target: ["web"],
    entry: './src/index.ts',
    mode: 'production',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: [
                    {
                        loader: 'ts-loader',
                        options: {configFile: "tsconfig.json"}
                    }
                ],
                exclude: /node_modules/,
            },
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
        fallback: {
            "stream": false,
            "util": false
        }
    },
    output: {
        filename: 'bfast.browser.js',
        library: {
            name: 'bfast',
            type: 'this',
        },
        path: path.resolve(__dirname, './dist'),
        libraryTarget: "umd"
    }
};
module.exports = [clientConfig];
