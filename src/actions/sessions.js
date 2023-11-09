import jwt              from 'jwt-simple';
import { v4 as uuidv4 } from 'uuid';

import { getData, saveData }     from 'templater-ui/src/utils/helpers/localStorage';
import { LOGOUT_EVENT }         from 'templater-ui/src/constants/localStorage';

import api              from 'ApiSingleton';
import sessionManager   from 'Utils/sessions';
import history          from 'History';
import {
    getCurrentTimezone
}                       from 'Utils/date';
import { SESSION_KEY }  from 'Constants/localStorage';
import { TOASTS_KEYS }  from 'Constants/toasts';
import * as ROUTES      from 'Constants/routes';
import {
    fetchAccountSettings
}                       from 'Actions/accountSettings';
import {
    fetchApiSettings
}                       from 'Actions/apiSettings';
import {
    fetchChangelog
}                       from 'Actions/updater';
import {
    stopNotificationsFetching,
    fetchNotificationsByInterval
}                               from 'Actions/notifications';
import {
    addToast,
    removeToastByKey
}                               from 'Actions/toasts';
import {
    fetchWorkspaceSettings
}                               from 'Actions/workspace';
import {
    apiErrorsHandler
}                               from 'Utils/errors/Api';
import i18n                     from 'I18next';


export const LOGIN        = 'LOGIN';
export const LOGIN_ERROR  = 'LOGIN_ERROR';
export const LOGOUT       = 'LOGOUT';


export function login({ data, onFinally, onError } = {}) {
    return async dispatch => {
        try {
            const response = await api.sessions.login(data);
            const { jwt: token } = response.data || {};

            const userData = jwt.decode(token, '', true);

            sessionManager.onSessionCreate({ token });

            dispatch({
                type    : LOGIN,
                payload : userData
            });

            history.push(ROUTES.ACCESS_SETTINGS);
            dispatch(removeToastByKey(TOASTS_KEYS.login));
        } catch (error) {
            const processError = apiErrorsHandler(error);

            if (error.type === 'SERVER_ERROR') {
                dispatch(addToast({
                    key     : TOASTS_KEYS.login,
                    title   : i18n.t('toats:Server error'),
                    message : i18n.t('toats:Please contact your system administrator!'),
                    type    : 'error'
                }));
            }

            dispatch({
                type    : LOGIN_ERROR,
                payload : error
            });

            if (onError) onError(processError);
        } finally {
            if (onFinally) onFinally();
        }
    };
}

export function register({ data, onFinally, onError } = {}) {
    return async dispatch => {
        try {
            const timezone = getCurrentTimezone() || 0;
            const response = await api.sessions.register({
                ...(data || {}),
                timezone
            });

            const { meta } = response;
            const { token } = meta || {};

            sessionManager.setSession({ token });

            dispatch({
                type    : LOGIN,
                payload : response?.data || {}
            });

            history.push(ROUTES.ACCESS_SETTINGS);
            dispatch(removeToastByKey(TOASTS_KEYS.login));
        } catch (error) {
            const processError = apiErrorsHandler(error);

            if (error?.type === 'SERVER_ERROR') {
                dispatch(addToast({
                    key     : TOASTS_KEYS.login,
                    title   : i18n.t('toats:Server error'),
                    message : i18n.t('toats:Please contact your system administrator!'),
                    type    : 'error'
                }));
            }

            dispatch({
                type    : LOGIN_ERROR,
                payload : error
            });

            if (onError) onError(processError);
        } finally {
            if (onFinally) onFinally();
        }
    };
}

export function passwordRestore({ data, onSuccess, onFinally, onError } = {}) {
    return async dispatch => {
        try {
            const response = await api.sessions.passwordRestore({
                ...(data || {})
            });

            if (onSuccess) onSuccess(response);
        } catch (error) {
            const processError = apiErrorsHandler(error);

            if (error?.type === 'SERVER_ERROR') {
                dispatch(addToast({
                    key     : TOASTS_KEYS.login,
                    title   : i18n.t('toats:Server error'),
                    message : i18n.t('toats:Please contact your system administrator!'),
                    type    : 'error'
                }));
            }

            if (onError) onError(processError);
        } finally {
            if (onFinally) onFinally();
        }
    };
}

export function passwordChange({ data, onSuccess, onFinally, onError } = {}) {
    return async dispatch => {
        try {
            const response = await api.sessions.passwordChange({
                ...(data || {})
            });

            if (onSuccess) onSuccess(response);
            const { meta : { newToken } = {} } = response || {};
            const userData = jwt.decode(newToken, '', true);

            sessionManager.onSessionCreate({ token: newToken });

            dispatch({
                type    : LOGIN,
                payload : userData
            });

            history.push(ROUTES.ACCESS_SETTINGS);
            dispatch(removeToastByKey(TOASTS_KEYS.login));
        } catch (error) {
            const processError = apiErrorsHandler(error);

            if (error?.type === 'SERVER_ERROR') {
                dispatch(addToast({
                    key     : TOASTS_KEYS.login,
                    title   : i18n.t('toats:Server error'),
                    message : i18n.t('toats:Please contact your system administrator!'),
                    type    : 'error'
                }));
            }

            if (onError) onError(processError);
        } finally {
            if (onFinally) onFinally();
        }
    };
}

export function logout({ logoutAllTabs = false } = {}) {
    return dispatch => {
        if (logoutAllTabs) {
            saveData(LOGOUT_EVENT, uuidv4());
        }

        sessionManager.removeSession();

        dispatch({ type: LOGOUT });

        history.push(ROUTES.LOGIN);
        dispatch(stopNotificationsFetching());
    };
}

export function checkSession() {
    return async (dispatch) => {
        const { pathname } = history.location;
        const { token } = getData(SESSION_KEY) || {};

        if (!token) {
            if (pathname !== ROUTES.LOGIN) history.push(ROUTES.LOGIN);

            return;
        }

        sessionManager.onSessionUpdate({ token });

        const userData = jwt.decode(token, '', true);

        dispatch({
            type    : LOGIN,
            payload : userData
        });

        if (pathname === ROUTES.LOGIN) {
            history.push(ROUTES.ACCESS_SETTINGS);
        }

        dispatch(fetchAccountSettings());
        dispatch(fetchWorkspaceSettings());
        dispatch(fetchApiSettings());
        dispatch(fetchNotificationsByInterval());
        dispatch(fetchChangelog());
    };
}
