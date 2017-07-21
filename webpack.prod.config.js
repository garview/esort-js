const webpack = require('webpack');
const path = require('path')
 const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
    entry: [
        "babel-polyfill",
        path.join(process.cwd(), "app/index.js")
    ],
    output: {
        path: path.join(process.cwd(), "dist"),
        filename: "[name].[chunkhash].js",
        chunkFilename: "[name].[chunkhash].chunk.js",
        publicPath: "/",
        //filename: "bundle.js",
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
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: "css-loader"
                })
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
    plugins: [
        //new webpack.ProvidePlugin({
        //  $: "jquery",
        //  jQuery: "jquery"
        //}),
        new webpack.DefinePlugin({
            "process.env": {
                NODE_ENV: JSON.stringify("production")
            }
        }),
        new ExtractTextPlugin("styles.css"),
        //new webpack.optimize.UglifyJsPlugin(),
        // new ExtractTextPlugin({
        // filename:  (getPath) => {
        // return getPath('css/[name].css').replace('css/js', 'css');
        // },
        // allChunks: true
        // }),
        new HtmlWebpackPlugin({template: "public/index.html"}),

        //new webpack.optimize.CommonsChunkPlugin({
        //    name: "vendor",
        //    minChunks: function (module) {
        //        return module.context && module.context.indexOf("node_modules") !== -1;
        //    }
        //}),
        //new webpack.optimize.CommonsChunkPlugin({
        //    name: "antd",
        //    minChunks: function (module) {
        //        return module.context && module.context.indexOf("antd") !== -1;
        //    }
        //}),
        //new webpack.optimize.CommonsChunkPlugin({
        //    name: "react",
        //    minChunks: function (module) {
        //        return module.context && module.context.indexOf("react") !== -1;
        //    }
        //}),
        //new webpack.optimize.CommonsChunkPlugin({
        //    name: "echarts",
        //    minChunks: function (module) {
        //        return module.context && module.context.indexOf("echarts") !== -1;
        //    }
        //}),
        // new webpack.optimize.CommonsChunkPlugin({
        // name: "manifest",
        // minChunks: Infinity
        // }),
    ],


}