const path = require('path');

const clientConfig = {
    target: "node",
    entry: './src/index.ts',
    mode: 'production',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: [
                    {
                        loader: 'ts-loader',
                        options: {configFile: "tsconfig.node.json"}
                    }
                ],
                exclude: /node_modules/,
            }
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    },
    output: {
        filename: 'bfast.node.js',
        path: path.resolve(__dirname, './dist'),
        libraryTarget: "commonjs",
        // globalObject: "this"
    },
};

module.exports = [clientConfig];
