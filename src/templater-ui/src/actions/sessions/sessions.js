import { v4 as uuidv4 }       from 'uuid';
import * as localStorageUtils from '../../utils/helpers/localStorage';
import { LOGOUT_EVENT }       from '../../constants/localStorage';
import { TOASTS_KEYS }        from './../../constants/toasts';
import * as ROUTES            from './../../constants/routes';
import {
    LOGIN,
    LOGOUT,
    LOGIN_ERROR,
    FIRST_LOGIN
}                             from './../../constants/actions/sessions';

import ActionsBase            from './../base';

export default class Sessions extends ActionsBase {
    constructor(...args) {
        super(...args);

        this.getCsrf         = this.getCsrf.bind(this);
        this.login           = this.login.bind(this);
        this.loginFacebook   = this.loginFacebook.bind(this);
        this.loginGoogle     = this.loginGoogle.bind(this);
        this.register        = this.register.bind(this);
        this.logout          = this.logout.bind(this);
        this.passwordRestore = this.passwordRestore.bind(this);
        this.passwordChange  = this.passwordChange.bind(this);
        this.onSessionCreate = this.onSessionCreate.bind(this);
        this.checkResetPasswordToken = this.checkResetPasswordToken.bind(this);

        this.removeToastByKey    = void 0;
        this.history             = void 0;
        this.connectBroker       = void 0;
        this.disconnectBroker    = void 0;
        this.afterRegisterCb     = void 0;
        this.afterSuccessLoginCb = void 0;
        this.publicRoutes        = [ ROUTES.LOGIN ];
        this.withLogout          = true;
    }

    getCsrf() {
        return async dispatch => {
            try {
                const response = await this.api.sessions.getCsrf();

                this.api.apiClient.setCsrfToken(response?.token);

                if (this.removeToastByKey) dispatch(this.removeToastByKey(TOASTS_KEYS.csrfError));
            } catch (err) {
                console.error('Get csrf error: ', err);

                throw (err);
            }
        };
    }

    onSessionCreate({ id, avatar_url, login, mqttCredentials } = {}) {
        return dispatch => {
            if (this.removeToastByKey) dispatch(this.removeToastByKey(TOASTS_KEYS.login));
            if (this.removeToastByKey) dispatch(this.removeToastByKey(TOASTS_KEYS.csrfError));
            if (this.removeToastByKey) dispatch(this.removeToastByKey(TOASTS_KEYS.forbidden));
            dispatch({
                type    : LOGIN,
                payload : {
                    id         : id || '',
                    avatar_url : avatar_url || '',
                    login      : login || ''
                }
            });

            if (this.history) this.history.push(ROUTES.INITIAL_PAGE);
            if (this.connectBroker) {
                dispatch(this.connectBroker({
                    data : mqttCredentials
                }));
            }
            if (this.afterSuccessLoginCb) this.afterSuccessLoginCb();
        };
    }

    login({ data, onSuccess, onFinally, onError } = { }) {
        return async dispatch => {
            try {
                const response = await this.api.sessions.login(data);

                dispatch(this.onSessionCreate({
                    id              : response?.id || '',
                    avatar_url      : response?.avatar_url || '',
                    login           : response?.login || '',
                    mqttCredentials : response?.mqttCredentials
                }));

                if (onSuccess) onSuccess();
            } catch (error) {
                dispatch({
                    type    : LOGIN_ERROR,
                    payload : error
                });

                if (onError) onError(error);
            } finally {
                if (onFinally) onFinally();
            }
        };
    }

    loginFacebook({ accessToken, onSuccess, onFinally, onError } = { }) {
        return async dispatch => {
            try {
                const response = await this.api.sessions.loginFacebook({ accessToken });

                if (response?.is_created) dispatch({ type: FIRST_LOGIN });
                dispatch(this.onSessionCreate({
                    id              : response?.id || '',
                    avatar_url      : response?.avatar_url || '',
                    login           : response?.login || '',
                    mqttCredentials : response?.mqttCredentials
                }));

                if (response?.is_created && this.afterRegisterCb) this.afterRegisterCb();
                if (onSuccess) onSuccess({ ...response });
            } catch (error) {
                dispatch({
                    type    : LOGIN_ERROR,
                    payload : error
                });

                if (onError) onError(error);
            } finally {
                if (onFinally) onFinally();
            }
        };
    }

    loginGoogle({ idToken, onSuccess, onFinally, onError } = { }) {
        return async dispatch => {
            try {
                const response = await this.api.sessions.loginGoogle({ idToken });

                if (response?.is_created) dispatch({ type: FIRST_LOGIN });
                dispatch(this.onSessionCreate({
                    id              : response?.id || '',
                    avatar_url      : response?.avatar_url || '',
                    login           : response?.login || '',
                    mqttCredentials : response?.mqttCredentials
                }));

                if (response?.is_created && this.afterRegisterCb) this.afterRegisterCb();
                if (onSuccess) onSuccess({ ...response });
            } catch (error) {
                dispatch({
                    type    : LOGIN_ERROR,
                    payload : error
                });

                if (onError) onError(error);
            } finally {
                if (onFinally) onFinally();
            }
        };
    }

    register({ data, onFinally, onSuccess, onError } = { }) {
        return async dispatch => {
            try {
                const response = await this.api.sessions.register(data);

                dispatch({ type: FIRST_LOGIN });
                dispatch(this.onSessionCreate({
                    id              : response?.id || '',
                    avatar_url      : response?.avatar_url || '',
                    login           : response?.login || '',
                    mqttCredentials : response?.mqttCredentials
                }));
                if (onSuccess) onSuccess();
                if (this.afterRegisterCb) this.afterRegisterCb();
            } catch (error) {
                dispatch({
                    type    : LOGIN_ERROR,
                    payload : error
                });

                if (onError) onError(error);
            } finally {
                if (onFinally) onFinally();
            }
        };
    }

    logout({ logoutAllTabs = false } = {}) {
        return dispatch => {
            try {
                dispatch({ type: LOGOUT });

                if (this.withLogout) this.api.sessions.logout();

                // dispatch LOGOUT_EVENT to trigger logout for all tabs
                if (logoutAllTabs) {
                    localStorageUtils.saveData(LOGOUT_EVENT, uuidv4());
                }

                const pathname = this?.history?.location?.pathname;

                if (!this?.publicRoutes || !this?.publicRoutes?.includes(pathname)) {
                    if (this.history) this.history.replace(ROUTES.LOGIN);
                }

                if (this.disconnectBroker) dispatch(this.disconnectBroker());
            } catch (error) {
                console.log('logout error', { error });
            }
        };
    }

    passwordRestore({ data, onSuccess, onFinally, onError } = {}) {
        return async () => {
            try {
                const response = await this.api.sessions.passwordRestore({
                    ...(data || {})
                });

                if (onSuccess) onSuccess(response);
            } catch (error) {
                if (onError) onError(error);
            } finally {
                if (onFinally) onFinally();
            }
        };
    }

    passwordChange({ data, onSuccess, onFinally, onError } = {}) {
        return async dispatch => {
            try {
                const response = await this.api.sessions.passwordChange({
                    ...(data || {})
                });

                if (onSuccess) onSuccess(response);

                dispatch(this.onSessionCreate({
                    id              : response?.id || '',
                    avatar_url      : response?.avatar_url || '',
                    login           : response?.login || '',
                    mqttCredentials : response?.mqttCredentials
                }));
            } catch (error) {
                if (onError) onError(error);
            } finally {
                if (onFinally) onFinally();
            }
        };
    }

    checkResetPasswordToken({ data, onSuccess, onFinally, onError } = {}) {
        return async () => {
            try {
                const response = await this.api.sessions.checkResetPasswordToken({
                    ...(data || {})
                });

                if (onSuccess) onSuccess(response);
            } catch (error) {
                if (onError) onError(error);
            } finally {
                if (onFinally) onFinally();
            }
        };
    }
}
