var isDevelopment =
    process.env.NODE_ENV === 'development'
    || process.env.WEBPACK_DEV_SERVER === 'true';

module.exports = {
    "extends": "webbylab",
    "settings": {
        "react": {
            "version": "16.13.0"
        },
        "import/resolver": {
            "babel-module": {
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
            }
        }
    },
    "plugins": [
        "babel"
    ],
    "rules": {
        "no-param-reassign"                  : 0,
        "more/no-window"                     : 0,
        "import/no-named-default"            : 0,
        "react/jsx-closing-tag-location"     : 0,
        "react/jsx-closing-bracket-location" : 0,
        "react/no-did-mount-set-state"       : 0, // deprecated rule
        "react/no-did-update-set-state"      : 0, // deprecated rule
        "newline-after-var"                  : 0, // deprecated rule
        "newline-before-return"              : 0, // deprecated rule
        "no-unused-expressions"              : 0, // fix for optional chaining
        "babel/no-unused-expressions"        : 1, // fix for optional chaining
        "react/no-multi-comp"                : 0,
        "max-lines-per-function"             : ["error", { "max": 120 }],
        "react/sort-comp"                    : [ "error", {
            "order": [
                "instance-variables",
                "constructor",
                "state",
                "static-methods",
                "lifecycle",
                "/get*/",
                "/set*/",
                "/^handle.+$/",
                "/^on.+$/",
                "everything-else",
                "/render*/",
                "render"
            ]
        }],
        "padding-line-between-statements": [
            "warn",
            {
                "blankLine": "always",
                "prev": "*",
                "next": ["return"]
            },
            {
                "blankLine": "always",
                "prev": ["var", "let", "const"],
                "next": ["*"]
            },
            {
                "blankLine": "any",
                "prev": ["var", "let", "const"],
                "next": ["var", "let", "const"]
            }
        ],
        "template-curly-spacing" : "off",
        "indent" : "off"
    }
}
