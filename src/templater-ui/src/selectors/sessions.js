export const isUserLoggedInSelector   = state => !!state?.sessions?.isUserLoggedIn;
export const isSessionCheckedSelector = state => !!state?.sessions?.isSessionChecked;
export const isFirstLoginSelector     = state => !!state?.sessions?.isFirstLogin;
