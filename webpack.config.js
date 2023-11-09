const webpack                   = require('webpack');
const path                      = require('path');
const HtmlWebpackPlugin         = require('html-webpack-plugin');
// const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');
// const UnusedWebpackPlugin       = require('unused-webpack-plugin');
// const CircularDependencyPlugin = require('circular-dependency-plugin');


const wbpClient = process.env.DOCKER === 'true'
    ? 'webpack-dev-server/client?https://0.0.0.0'
    : 'webpack-dev-server/client?http://0.0.0.0:3000';
const paths = {
    appHtml     : path.join(__dirname, '/public/index.html'),
    appBuild    : path.join(__dirname, '/public/')
};

module.exports = {
    mode : 'development',

    devtool : 'eval-source-map',

    entry : [
        'react-hot-loader/patch',
        wbpClient,
        'webpack/hot/only-dev-server',
        './src/main.js'
    ],

    output : {
        path       : paths.appBuild,
        filename   : 'static/build.js',
        publicPath : '/'
    },

    module : {
        rules : [
            {
                test    : /\.js$/,
                include: [
                    path.resolve(__dirname, 'src')
                ],
                use     : [
                    {
                        loader  : 'babel-loader'
                    },
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
                use : [
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
        // new CircularDependencyPlugin({
        //     // exclude detection of files based on a RegExp
        //     // include specific files based on a RegExp
        //     include          : /src/,
        //     // add errors to webpack instead of warnings
        //     failOnError      : true,
        //     // allow import cycles that include an asyncronous import,
        //     // e.g. via import(/* webpackMode: "weak" */ './file.js')
        //     allowAsyncCycles : false,
        //     // set the current working directory for displaying module paths
        //     cwd              : process.cwd()
        // }),
        new HtmlWebpackPlugin({
            inject             : true,
            template           : paths.appHtml,
            templateParameters : () => ({
                updateConfig : '',
                buildFiles   : '',
                initBundle   : ''
            })
        }),
        new webpack.DefinePlugin({
            'process.env' : {
                NODE_ENV : JSON.stringify(process.env.NODE_ENV || 'development')
            }
        }),
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        // new UnusedWebpackPlugin({
        //     directories : [ path.join(__dirname, 'src') ]
        // })
    ]
};
