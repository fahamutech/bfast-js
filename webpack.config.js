const path = require('path');

const clientConfig = {
    target: ["web"],
    entry: './src/bfast.ts',
    mode: 'production',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                // type: 'javascript/esm',
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
        extensions: ['.tsx', '.ts', '.js']
    },
    output: {
        filename: 'bfast.js',
        path: path.resolve(__dirname, './dist'),
        globalObject: 'this',
        libraryTarget: "umd"
    }
};
module.exports = [clientConfig];
