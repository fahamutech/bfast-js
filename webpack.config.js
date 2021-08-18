const path = require('path');

const clientConfig = {
    target: ["web"],
    entry: './src/bfast.ts',
    mode: 'production',
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
        fallback: {
            "stream": false
        }
    },
    output: {
        filename: 'bfast.js',
        path: path.resolve(__dirname, './dist'),
        globalObject: 'this',
        libraryTarget: "umd"
    }
};
module.exports = [clientConfig];
