const path = require('path');

module.exports = {
  mode: 'development',
  resolve: {
    alias: {
      dcv: path.resolve("C:\\Users\\Sri Harsha\\Desktop\\InceptionRobotics\\frontend\\inception_robotics_fe\\src\\components\\dcvjs-esm\\dcv.js"),
    },
  },
  module: {
    rules: [
      {
        test: /\.js$|\.jsx$/, // Update the regex pattern to include .jsx files
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.svg$/,
        use: ['file-loader'],
      },
    ],
  },
  output: {
    path: path.resolve("C:\\Users\\Sri Harsha\\Desktop\\InceptionRobotics\\frontend\\inception_robotics_fe\\output"),
    filename: 'bundle.js',
  },
};