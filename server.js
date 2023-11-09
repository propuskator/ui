const webpack          = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const config           = require('./webpack.config.js');
const path             = require('path');

new WebpackDevServer(webpack(config), {
    // http2              : true,
    // https              : true,
    publicPath         : config.output.publicPath,
    hot                : true,
    historyApiFallback : true,
    contentBase        : path.join(__dirname, 'public'),
    progress           : true,
    quiet              : false,
    noInfo             : false,
    stats              : { colors: true }
}).listen(3000, '0.0.0.0', (err, result) => {
    if (err) return console.log(err);
});
