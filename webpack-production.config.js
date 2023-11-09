const webpack                = require('webpack');
const path                   = require('path');
const TerserPlugin           = require('terser-webpack-plugin');
const HtmlWebpackPlugin      = require('html-webpack-plugin');
const CopyPlugin             = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
// const BundleAnalyzerPlugin   = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const paths = {
    appHtml  : path.join(__dirname, './public/index.html'),
    appBuild : path.join(__dirname, './build')
};

module.exports = {
    mode : 'production',

    entry : {
        app : [
            './src/main.js'
        ]
    },

    output : {
        path       : paths.appBuild,
        publicPath : '/',
        filename   : 'static/[name].[hash:8].js'
    },

    module : {
        rules : [
            {
                test    : /\.js$/,
                exclude : /node_modules/,
                use     : [
                    'babel-loader',
                    {
                        loader  : 'eslint-loader',
                        options : {
                            emitWarning : true
                        }
                    }
                ]
            },
            {
                test    : /\.less$/,
                exclude : /node_modules/,
                use     : [
                    'style-loader',
                    {
                        loader  : 'css-loader',
                        options : {
                            modules        : true,
                            importLoaders  : 2,
                            localIdentName : '[path][name]__[local]--[hash:base64:5]'
                        }
                    },
                    'less-loader',
                    {
                        loader  : 'postcss-loader',
                        options : {
                            ident   : 'postcss',
                            plugins : [
                                require('stylelint')(),
                                require('autoprefixer')()
                            ]
                        }
                    }
                ]
            },
            {
                test    : /\.(otf|eot|ttf|ttc|woff|jpe?g|png|gif)$/,
                exclude : /node_modules/,
                use     : [
                    {
                        loader  : 'url-loader',
                        options : {
                            limit    : 24000,
                            esModule : false
                        }
                    }
                ]
            },
            {
                // hack to deteck js imports
                test   : /\.svg(\?v=\d+\.\d+\.\d+)?$/,
                issuer : {
                    test : /\.jsx?$/
                },
                use : [
                    {
                        loader : '@svgr/webpack'
                    },
                    {
                        loader  : 'url-loader',
                        options : {
                            limit      : 24000,
                            esModule   : false,
                            svgoConfig : {
                                plugins : {
                                    removeViewBox : false
                                }
                            }
                        }
                    }
                ]
            },
            {
                // hack to deteck not js imports
                test    : /\.svg(\?v=\d+\.\d+\.\d+)?$/,
                loader  : 'url-loader',
                options : {
                    limit    : 24000,
                    esModule : false
                }
            }
        ]
    },

    plugins : [
        new CleanWebpackPlugin(),
        new webpack.IgnorePlugin(/(locale)/, /node_modules.+(moment)/),
        new HtmlWebpackPlugin({
            inject             : false,
            template           : paths.appHtml,
            templateParameters : (compilation, assets) => ({
                updateConfig : '<script src="/static/updateConfig.js"></script>',
                initBundle   : '<script src="/static/initBundle.js"></script>',
                buildFiles   : `<script>window.buildJsFiles=[${assets.js.map(js => `'${js}'`).join(',')}];</script>`
            }),
            minify : {
                collapseWhitespace        : true,
                removeComments            : true,
                removeRedundantAttributes : true
            }
        }),
        new CopyPlugin([
            {
                from   : 'public/',
                ignore : [ '*.html', '.gitkeep' ]
                // , transform(content, path) {
                //     return optimize(content);
                // }
            }
        ]),
        new webpack.DefinePlugin({
            'process.env' : {
                NODE_ENV : JSON.stringify(process.env.NODE_ENV || 'development')
            }
        })
        // , new BundleAnalyzerPlugin()
    ],

    optimization : {
        minimizer : [
            new TerserPlugin({
                // i'm not sure whether this would be really helpful
                // due to fact we currently have only 1 cpu core available on our CI server
                parallel : false
            })
        ]
    }
};
