import * as localStorageUtils            from 'templater-ui/src/utils/helpers/localStorage';
import { LOCALE_KEY }                    from 'Constants/localStorage';

import {
    LANGUAGES,
    DEFAULT_LANG
}                                         from './data';

const LOCALES_LIST = Object.values(LANGUAGES);

function getBrowserLocale() {
    const browserLang = navigator.languages
        ? navigator.languages[0]
        : (navigator.language || navigator.userLanguage);

    return browserLang?.split('-')[0];
}

export function getInitialLocale() {
    const lsLocale = localStorageUtils.getData(LOCALE_KEY) || getBrowserLocale();

    return lsLocale && LOCALES_LIST.includes(lsLocale) ? lsLocale : DEFAULT_LANG;
}

export function changeLanguage(i18n, langId) {
    if (!i18n || !langId || !LOCALES_LIST.includes(langId)) return;

    if (i18n.language === langId) return;

    i18n.changeLanguage(langId);
    localStorageUtils.saveData(LOCALE_KEY, langId);
}
