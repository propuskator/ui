// en
import enTemplater         from 'templater-ui/src/constants/langs/en.json';
import enTranslations      from './locales/en/translation.json';
import enErrors            from './locales/en/errors.json';
import enSidebar           from './locales/en/sidebar.json';
import enTables            from './locales/en/tables.json';
import enFilters           from './locales/en/filters.json';
import enAccessPage        from './locales/en/access-page.json';
import enApiSettingsPage   from './locales/en/api-settings-page.json';
import enAccessLogsPage    from './locales/en/access-logs-page.json';
import enReadersGroupsPage from './locales/en/readers-groups-page.json';
import enSchedulesPage     from './locales/en/schedules-page.json';
import enSubjectsPage      from './locales/en/subjects-page.json';
import enReadersPage       from './locales/en/readers-page.json';
import enTokensPage        from './locales/en/tokens-page.json';
import enCamerasPage       from './locales/en/cameras-page.json';
import enNotifications     from './locales/en/notifications.json';
import enToasts            from './locales/en/toasts.json';
import enAccountSettings   from './locales/en/account-settings.json';

// ru
// eslint-disable-next-line import/order
import ruTemplater         from 'templater-ui/src/constants/langs/ru.json';
import ruTranslations      from './locales/ru/translation.json';
import ruErrors            from './locales/ru/errors.json';
import ruSidebar           from './locales/ru/sidebar.json';
import ruTables            from './locales/ru/tables.json';
import ruFilters           from './locales/ru/filters.json';
import ruAccessPage        from './locales/ru/access-page.json';
import ruApiSettingsPage   from './locales/ru/api-settings-page.json';
import ruAccessLogsPage    from './locales/ru/access-logs-page.json';
import ruReadersGroupsPage from './locales/ru/readers-groups-page.json';
import ruSchedulesPage     from './locales/ru/schedules-page.json';
import ruSubjectsPage      from './locales/ru/subjects-page.json';
import ruReadersPage       from './locales/ru/readers-page.json';
import ruTokensPage        from './locales/ru/tokens-page.json';
import ruCamerasPage       from './locales/ru/cameras-page.json';
import ruNotifications     from './locales/ru/notifications.json';
import ruToasts            from './locales/ru/toasts.json';
import ruAccountSettings   from './locales/ru/account-settings.json';

// ua
// eslint-disable-next-line import/order
import uaTemplater         from 'templater-ui/src/constants/langs/ua.json';
import uaTranslations      from './locales/ua/translation.json';
import uaErrors            from './locales/ua/errors.json';
import uaSidebar           from './locales/ua/sidebar.json';
import uaTables            from './locales/ua/tables.json';
import uaFilters           from './locales/ua/filters.json';
import uaAccessPage        from './locales/ua/access-page.json';
import uaApiSettingsPage   from './locales/ua/api-settings-page.json';
import uaAccessLogsPage    from './locales/ua/access-logs-page.json';
import uaReadersGroupsPage from './locales/ua/readers-groups-page.json';
import uaSchedulesPage     from './locales/ua/schedules-page.json';
import uaSubjectsPage      from './locales/ua/subjects-page.json';
import uaReadersPage       from './locales/ua/readers-page.json';
import uaTokensPage        from './locales/ua/tokens-page.json';
import uaCamerasPage       from './locales/ua/cameras-page.json';
import uaNotifications     from './locales/ua/notifications.json';
import uaToasts            from './locales/ua/toasts.json';
import uaAccountSettings   from './locales/ua/account-settings.json';

export const LANGUAGES = {
    RU : 'ru',
    EN : 'en',
    UK : 'uk'
};

export const DEFAULT_LANG = LANGUAGES.EN;

export const LANGUAGES_DATA = {
    [LANGUAGES.RU] : {
        label       : 'Русский',
        cropped     : 'Рус',
        contraction : 'ru'
    },
    [LANGUAGES.EN] : {
        label       : 'English',
        cropped     : 'Eng',
        contraction : 'en'
    },
    [LANGUAGES.UK] : {
        label       : 'Українська',
        cropped     : 'Укр',
        contraction : 'ua'
    }
};

export const RESOURCES = {
    [LANGUAGES.EN] : {
        translation : {
            ...enTranslations,
            ...enTemplater
        },
        errors                : enErrors,
        sidebar               : enSidebar,
        tables                : enTables,
        filters               : enFilters,
        'access-page'         : enAccessPage,
        'api-settings-page'   : enApiSettingsPage,
        'access-logs-page'    : enAccessLogsPage,
        'readers-groups-page' : enReadersGroupsPage,
        'readers-page'        : enReadersPage,
        'schedules-page'      : enSchedulesPage,
        'subjects-page'       : enSubjectsPage,
        'tokens-page'         : enTokensPage,
        'cameras-page'        : enCamerasPage,
        notifications         : enNotifications,
        toasts                : enToasts,
        settings              : enAccountSettings
    },
    [LANGUAGES.RU] : {
        translation : {
            ...ruTranslations,
            ...ruTemplater
        },
        errors                : ruErrors,
        sidebar               : ruSidebar,
        tables                : ruTables,
        filters               : ruFilters,
        'access-page'         : ruAccessPage,
        'api-settings-page'   : ruApiSettingsPage,
        'access-logs-page'    : ruAccessLogsPage,
        'readers-groups-page' : ruReadersGroupsPage,
        'readers-page'        : ruReadersPage,
        'schedules-page'      : ruSchedulesPage,
        'subjects-page'       : ruSubjectsPage,
        'tokens-page'         : ruTokensPage,
        'cameras-page'        : ruCamerasPage,
        notifications         : ruNotifications,
        toasts                : ruToasts,
        settings              : ruAccountSettings
    },
    [LANGUAGES.UK] : {
        translation : {
            ...uaTranslations,
            ...uaTemplater
        },
        errors                : uaErrors,
        sidebar               : uaSidebar,
        tables                : uaTables,
        filters               : uaFilters,
        'access-page'         : uaAccessPage,
        'api-settings-page'   : uaApiSettingsPage,
        'access-logs-page'    : uaAccessLogsPage,
        'readers-groups-page' : uaReadersGroupsPage,
        'readers-page'        : uaReadersPage,
        'schedules-page'      : uaSchedulesPage,
        'subjects-page'       : uaSubjectsPage,
        'tokens-page'         : uaTokensPage,
        'cameras-page'        : uaCamerasPage,
        notifications         : uaNotifications,
        toasts                : uaToasts,
        settings              : uaAccountSettings
    }
};

