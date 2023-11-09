export const ROOT                  = '/';
export const LOGIN                 = `${ROOT}login`;
export const REGISTER              = `${ROOT}register`;
export const PASSWORD_RESTORE      = `${ROOT}password-restore`;
export const PASSWORD_CHANGE       = `${ROOT}password-change`;

export const DEEPLINK_FOR_REGISTER_MOB = `${ROOT}app/REGISTRATION`;
export const DEEPLINK_FOR_REGISTER_REQUEST_MOB = `${ROOT}app/REQUEST`;
export const DEEPLINK_LOGIN_AFTER_REGISTER_MOB = `${ROOT}app/LOGIN`;

export const MOB_DEEPLINKS_FALLBACK = [
    DEEPLINK_FOR_REGISTER_MOB,
    DEEPLINK_FOR_REGISTER_REQUEST_MOB,
    DEEPLINK_LOGIN_AFTER_REGISTER_MOB
];

export const ACCESS_SETTINGS       = `${ROOT}access`;
export const API_SETTINGS          = `${ROOT}api-settings`;
export const ACCESS_LOGS           = `${ROOT}access-logs`;
export const ACCESS_TOKEN_READERS  = `${ROOT}access-points`;
export const ACCESS_READERS_GROUPS = `${ROOT}access-groups`;
export const ACCESS_SUBJECTS       = `${ROOT}subjects`;
export const ACCESS_SUBJECT_TOKENS = `${ROOT}tags`;
export const ACCESS_SCHEDULES      = `${ROOT}time`;
export const CAMERAS               = `${ROOT}cameras`;
export const ACCOUNT_SETTINGS      = `${ROOT}account-settings`;

export const INITIAL_APP_ROUTE     = ACCESS_SETTINGS;

export const NO_MATCH              = '*';
