const path = require('path');

const clientConfig = {
    target: "web",
    entry: './src/bfast_js.ts',
    mode: 'production',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    },
    output: {
        filename: 'bfast_js.js',
        path: path.resolve(__dirname, 'dist'),
        libraryTarget: "umd"
    },
    devServer: {
        // host: '0.0.0.0', // Required for docker
        // publicPath: '/',
        contentBase: path.resolve(__dirname, "./dist/"),
        // watchContentBase: true,
        // compress: true,
        // port: 9001
    },
    // devtool: "inline-source-map"
};

// const serverConfig = {
//     target: 'node',
//     mode: 'production',
//     module: {
//         rules: [
//             {
//                 test: /\.tsx?$/,
//                 use: 'ts-loader',
//                 exclude: /node_modules/
//             }
//         ]
//     },
//     resolve: {
//         extensions: ['.tsx', '.ts', '.js']
//     },
//     entry: './src/bfast_js.ts',
//     output: {
//         path: path.resolve(__dirname, 'dist'),
//         filename: 'bfast_node.js',
//         libraryTarget: "commonjs"
//     }
// };

module.exports = [clientConfig];
