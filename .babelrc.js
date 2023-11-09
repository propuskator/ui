

module.exports = {
        "presets" : [
            "@babel/preset-env",
            "@babel/preset-react"
        ],
        "plugins" : [
            "react-hot-loader/babel",
            "@babel/plugin-proposal-object-rest-spread",
            "@babel/plugin-proposal-optional-chaining",
            ["@babel/plugin-proposal-class-properties", { "loose": false }],
            ["@babel/plugin-transform-modules-commonjs", {
                "allowTopLevelThis": true
            }],
            "@babel/plugin-syntax-dynamic-import",
            [ "@babel/plugin-proposal-decorators", {
                "decoratorsBeforeExport": true
            } ],
            [ 'babel-plugin-import', {
                'libraryName'              : '@material-ui/core',
                // Use "'libraryDirectory' : ''," if your bundler does not support ES modules
                'libraryDirectory'         : 'esm',
                'camel2DashComponentName'  : false
            }, 'core' ],
            [ 'babel-plugin-import', {
                'libraryName'              : '@material-ui/icons',
                // Use "'libraryDirectory' : ''," if your bundler does not support ES modules
                'libraryDirectory'         : 'esm',
                'camel2DashComponentName'  : false
            }, 'icons' ],
            [ "babel-plugin-module-resolver", {
                "alias": {
                    "Base"         : "./src/components/base/",
                    "Shared"       : "./src/components/shared/",
                    "Layouts"      : "./src/components/layouts/",
                    "Pages"        : "./src/components/pages/",
                    "Modals"       : "./src/components/modals/",
                    "Constants"    : "./src/constants/",
                    "Utils"        : "./src/utils/",
                    "History"      : "./src/history.js",
                    "Store"        : "./src/store/",
                    "Selectors"    : "./src/selectors/",
                    "Actions"      : "./src/actions/",
                    "ApiSingleton" : "./src/apiSingleton.js",
                    "Context"      : "./src/context/",
                    "Assets"       : "./src/assets/",
                    "Config"       : "./src/config.js",
                    "SmartHome"    : "./src/smartHome/",
                    "I18next"      : "./src/i18n/",
                    "templater-ui" : "./src/templater-ui/"
                }
            } ],
            // [
            //     "i18next-extract", {
            //         "locales"        : [ "ru", "en" ],
            //         "outputPath"     : "src/i18n/locales/{{locale}}/{{ns}}.json",
            //         "jsonSpace"      : 4,
            //         "discardOldKeys" : true,
            //         "keySeparator"   : null
            //     }
            // ]
        ],
}