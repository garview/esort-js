const webpack = require('webpack');
const path = require('path')
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
module.exports = {
  devtool: "eval-source-map",
  entry:  ["babel-polyfill",__dirname + "/app/index.js"],
  output: {
    path: __dirname + "/public",
    // filename: "[name].[hash].js",
    filename: "bundle.js",
    publicPath: "/",
  },

  module: {
    rules: [
      {
        test: /\.json$/,
        use: 'json-loader'
      },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader?cacheDirectory=true',

        }
      },
      {
        test: /\.css$/,
        use: ['style-loader','css-loader']
      },
      {
        test: /\.(png|jpg|gif|eot|svg|ttf|woff|woff2)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'url-loader?limit=1024&name=images/[name].[ext]',
            options: {
              limit: 8192
            }
          }
        ]
      },
      {
        test: /\.less$/,
        use: [{
          loader: "style-loader" // creates style nodes from JS strings
        }, {
          loader: "css-loader" // translates CSS into CommonJS
        }, {
          loader: "less-loader" // compiles Less to CSS
        }]
      }
    ]
  },
  plugins:[
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery"
    }),
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify("development")
      }
    }),
    new HtmlWebpackPlugin({template: "public/index.html"}),
    // new ExtractTextPlugin({
    // filename:  (getPath) => {
    // return getPath('css/[name].css').replace('css/js', 'css');
    // },
    // allChunks: true
    // }),
    // new HtmlWebpackPlugin(),
    // new webpack.optimize.CommonsChunkPlugin({
    // name: "vendor",
    // minChunks: function(module){
    // return module.context && module.context.indexOf("node_modules") !== -1  ;
    // }
    // }),
    // new webpack.optimize.CommonsChunkPlugin({
    // name: "manifest",
    // minChunks: Infinity
    // }),
     new BundleAnalyzerPlugin(),
  ],
  devServer: {
    contentBase: path.join(__dirname, "public"),
    //compress: true,
    port: 9000,
    historyApiFallback: true,
    //quiet: true,
    inline: true,
  },

}