// webpack.config.js
module.exports = {
    entry: "./src/core/index.js",
    externals: {
      cordova: 'cordova'
    },
    output: {
        path: "www/",
        filename: "kumulos-sdk-core.js",
        libraryTarget: 'commonjs2'
    },
    module: {
      loaders: [
        { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader"}
      ]
    }
};