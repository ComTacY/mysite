const HtmlWebPackPlugin = require("html-webpack-plugin");
const path = require('path');

const htmlWebpackPlugin = new HtmlWebPackPlugin({
  template: "./src/client/index.html",
  filename: "./index.html"
});
 module.exports = {
  entry:[
    "babel-polyfill",
    "./src/client/client.js"
  ],
  output: {
    path: path.resolve('dist'),
    filename: 'client.min.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      },
      {
        test: /\.(png|jpg|gif)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
            }
          }
        ]
      }
    ]
  },
  plugins: [htmlWebpackPlugin]
};
