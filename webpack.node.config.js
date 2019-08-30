const path = require('path');

module.exports = {
  target: "node",
  entry: './src/index.ts',
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
    extensions: [ '.tsx', '.ts', '.js' ]
  },
  output: {
    filename: 'bfast_node.js',
    path: path.resolve(__dirname, 'dist'),
    library: 'BFast',
    libraryTarget: "commonjs"
  },
  // externals: [nodeExternals()]
};
