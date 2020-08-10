const path = require('path');

const clientConfig = {
    target: "web",
    entry: './src/bfast.ts',
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
        extensions: ['.tsx', '.ts', '.js']
    },
    output: {
        filename: 'bfast_js.js',
        path: path.resolve(__dirname, './dist'),
        library: '',
        libraryExport: '',
        globalObject: 'this',
        libraryTarget: "umd"
    }
};
module.exports = [clientConfig];
