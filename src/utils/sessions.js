import jwt             from 'jwt-simple';

import {
    saveData,
    getData,
    removeItem
}                      from 'templater-ui/src/utils/helpers/localStorage';

import { SESSION_KEY } from 'Constants/localStorage';
import { TOASTS_KEYS } from 'Constants/toasts';
import {
    stopNotificationsFetching
}                      from 'Actions/notifications';
import {
    addToast
}                      from 'Actions/toasts';
import {
    isBrokerConnectedSelector
}                     from 'Selectors/broker';
import {
    connectBroker,
    disconnectBroker
}                      from 'Actions/broker';
import store           from 'Store';
import history         from 'History';
import * as ROUTES     from 'Constants/routes';
import i18n            from 'I18next';

class SessionManager {
    constructor() {
        this.session = getData(SESSION_KEY) || {};
    }

    get accessToken() {
        return this.session?.token;
    }

    getExpirationDate(token) {
        if (!token) {
            return null;
        }
        const data = jwt.decode(token, '', true);
        const MILLISECONDS_IN_SECOND = 1000;

        return data?.exp * MILLISECONDS_IN_SECOND || null;
    }

    isExpired(exp) {
        if (!exp) return false;

        return Date.now() > exp;
    }

    async getSession() {
        return (this?.session?.token) ? this.session : {};
    }

    onSessionCreate(session) {
        this.setSession(session);

        store.dispatch(connectBroker());
    }

    onSessionChecked({ isSuccess = false } = {}) {
        if (!isSuccess) return;
        const isBrokerConnected = isBrokerConnectedSelector(store.getState());

        if (!isBrokerConnected) store.dispatch(connectBroker());
    }

    onSessionUpdate(session) {
        this.setSession(session);
    }

    onSessionDestroy(error, showToast = true) {
        const isSessionDestroyed = error.type === 'forbidden' && this.session?.token;

        if (!isSessionDestroyed) return;

        if (showToast) {
            store.dispatch(addToast({
                key                  : TOASTS_KEYS.login,
                title                : i18n.t('toasts:Session has been expired'),
                message              : i18n.t('toasts:Please login again'),
                type                 : 'error',
                showOnSessionDestroy : true
            }));
        }

        this.removeSession();

        store.dispatch({ type: 'LOGIN_ERROR', payload: { type: error.type } });
        history.push(ROUTES.LOGIN);
    }

    setSession(session) {
        this[SESSION_KEY] = session;
        saveData(SESSION_KEY, session);
    }

    removeSession() {
        removeItem(SESSION_KEY);
        this.setSession(null);
        store.dispatch(stopNotificationsFetching());
        store.dispatch(disconnectBroker());
    }
}

export default new SessionManager();
