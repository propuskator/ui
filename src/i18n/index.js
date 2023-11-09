import i18n                              from 'i18next';
import { initReactI18next }              from 'react-i18next';

import { getInitialLocale }              from './utils.js';
import {
    DEFAULT_LANG,
    RESOURCES
}                                        from './data';


const currentLocale = getInitialLocale();

i18n.use(initReactI18next)
    .init({
        lng               : currentLocale,
        fallbackLng       : DEFAULT_LANG,
        resources         : RESOURCES,
        debug             : false,
        keySeparator      : false,
        returnEmptyString : false,
        interpolation     : {
            escapeValue : false
        }
    });

export default i18n;
