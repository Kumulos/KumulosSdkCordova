// webpack.config.js
module.exports = {
    mode: 'development',
    entry: "./src/core/index.js",
    externals: {
      cordova: 'cordova'
    },
    output: {
        path: __dirname + "/www/",
        filename: "kumulos-sdk-core.js",
        libraryTarget: 'commonjs2',
        chunkFilename: '[name].bundle.js',
        chunkLoadingGlobal: 'ks_wpJsonp',
        publicPath: 'plugins/cordova-plugin-kumulos-sdk/www/'
    },
    module: {
      rules: [
        { test: /\.js$/, exclude: /node_modules/, use: [{loader: "babel-loader"}]}
      ]
    }
};