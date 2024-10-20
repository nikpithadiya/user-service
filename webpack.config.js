const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  entry: './handler.ts',
  target: 'node',
  externals: [nodeExternals()],
  mode: 'production',
  resolve: {
    extensions: ['.js', '.ts'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  output: {
    libraryTarget: 'commonjs',
    path: path.resolve(__dirname, '.webpack'),
    filename: 'handler.js',
  },
};
