const path = require('path');

const clientConfig = {
    target: "node",
    entry: '../src/bfast_js.ts',
    mode: 'production',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: [
                    {
                        loader: 'ts-loader',
                        options: {configFile: "tsconfig-node.json"}
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
        filename: 'bfast_node.js',
        path: path.resolve(__dirname, './dist'),
        libraryTarget: "commonjs"
    },
};

module.exports = [clientConfig];
