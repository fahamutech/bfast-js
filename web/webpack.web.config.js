const path = require('path');

module.exports = {
  target: "web",
  entry: './src/index.ts',
  mode: 'development',
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
    extensions: [ '.tsx', '.ts', '.js' ]
  },
  output: {
    filename: 'bfast_js.js',
    path: path.resolve(__dirname, 'dist'),
    library: 'BFast',
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
  devtool: "inline-source-map"
};
