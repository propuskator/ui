import { stringify }   from 'templater-ui/src/utils/query';
import sessionManager  from 'Utils/sessions';
import store           from 'Store';
import history         from 'History';
import {
    addToast,
    removeToastByKey
}                      from 'Actions/toasts';
import {
    fetchNotificationsByInterval,
    stopNotificationsFetching
}                      from 'Actions/notifications';
import { TOASTS_KEYS } from 'Constants/toasts';
import * as ROUTES     from 'Constants/routes';
import { FETCH_ERROR } from 'Utils/errors/Api';
import i18n            from 'I18next';

export default class ApiClient {
    constructor({ prefix = 'v1/', apiUrl = '', withFetchError = true } = {}) {
        this.apiUrl = apiUrl;
        this.prefix = prefix;
        // bad fix for updater api
        // возможно если логика будет различаться еще больше сделать UpdaterApiClient
        this.withFetchError = withFetchError;
    }

    async get(url, params, config = {}) {
        return this.request({
            url,
            params,
            method : 'GET'
        }, config);
    }

    async post(url, payload = {}, config = {}) {
        return this.request({
            url,
            method : 'POST',
            body   : payload
        }, config);
    }

    async put(url, payload = {}, config = {}) {
        return this.request({
            url,
            method : 'PUT',
            body   : payload
        }, config);
    }

    async patch(url, payload = {}, config = {}) {
        return this.request({
            url,
            method : 'PATCH',
            body   : payload
        }, config);
    }

    async delete(url, payload = {}, config = {}) {
        return this.request({
            url,
            method : 'DELETE',
            body   : payload
        }, config);
    }

    request = async ({ url, method, params = {}, body }, meta = {}) => {
        try {
            const { token } = await sessionManager.getSession() || { };
            const isFormData = !!meta?.isFormData;
            const lang = this.getLang ? this.getLang() : void 0;

            const query = Object.keys(params).length ? `?${stringify(params)}` : '';
            const headers = {
                'Cache-Control'                : 'no-cache',
                'pragma'                       : 'no-cache',
                'Access-Control-Allow-Headers' : 'x-authtoken',
                ...(lang  ? { 'Accept-Language': lang } : {}),
                'X-AuthToken'                  : token
            };

            if (!isFormData) {
                headers['Content-Type'] = 'application/json';
            } else {
                // headers['Content-Type'] = 'multipart/form-data';
            }

            const bodyData = !isFormData
                ? JSON.stringify(body)
                : body;

            const response = await fetch(
                `${this.apiUrl}${this.prefix}${url}${query}`,
                {
                    method,
                    headers,
                    withCredentials : true,
                    crossDomain     : false,
                    body            : method !== 'GET' ? bodyData : undefined
                }
            );

            let content;

            if ([ 'text/csv; charset=UTF-8' ].includes(response.headers.get('Content-Type'))) {
                content = await response.text();
            } else {
                content = await response.json();
            }

            const responseToken = response.headers.get('X-AuthToken');

            if (responseToken && !meta?.withoutTokenRefresh) sessionManager.setSession({ token: responseToken });

            if (content.status === 0) throw content;

            if (this.withFetchError && this.fetchError) this.clearFetchError();

            return content;
        } catch (error) {
            if (this.withFetchError) {
                if (error.message === 'Failed to fetch') {
                    return this.onFetchError(error);
                }

                this.clearFetchError();
            }

            // in check session action trigger accountSettings request
            const showDestroySessionToast = !(url === 'profile' && method === 'GET');

            sessionManager.onSessionDestroy(error, showDestroySessionToast);

            if (error.stack === 'TypeError: Failed to fetch') {
                const serverError = { type: 'SERVER_ERROR' };

                throw serverError;
            }

            throw error;
        }
    }

    onFetchError(error) {
        this.fetchError = error;

        store.dispatch(stopNotificationsFetching());
        store.dispatch(addToast({
            key                  : TOASTS_KEYS.fetchError,
            title                : i18n.t('Server doesn\'t respond'),
            message              : i18n.t('Please try again'),
            showOnSessionDestroy : true,
            hideByTimeout        : false,
            withCloseAbility     : false,
            controls             : [ {
                label   : i18n.t('Reload'),
                onClick : () => window.location.reload(),
                props   : {
                    variant : 'outlined'
                }
            } ],
            type : 'error'
        }));

        throw new FETCH_ERROR();
    }

    clearFetchError() {
        if (!this.fetchError) return;

        this.fetchError = null;

        store.dispatch(removeToastByKey(TOASTS_KEYS.fetchError));

        if (history.location.pathname !== ROUTES.LOGIN) {
            store.dispatch(fetchNotificationsByInterval());
        }
    }

    getLang() {
        return i18n.language;
    }
}
