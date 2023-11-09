import { stringify }          from './../utils/query';
import * as localStorageUtils from './../utils/helpers/localStorage';
import {
    CSRF_TOKEN_KEY
}                             from './../constants/localStorage';

export default class ApiClient {
    constructor({
        prefix = 'v1/', apiUrl = ''
    } = {}) {
        this.apiUrl        = apiUrl;
        this.prefix        = prefix;
        this.csrfToken     = localStorageUtils.getData(CSRF_TOKEN_KEY) || '';

        this.onError           = void 0;
        this.onFetchError      = void 0;
        this.onFetchErrorClear = void 0;
        this.getLang           = void 0;
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
            const isFormData = !!meta?.isFormData;
            const lang = this.getLang ? this.getLang() : void 0;

            const query = Object.keys(params).length ? `?${stringify(params)}` : '';
            const headers = {
                'Cache-Control' : 'no-cache',
                'pragma'        : 'no-cache',
                ...(lang  ? { 'Accept-Language': lang } : {}),
                ...(!isFormData ? { 'Content-Type': 'application/json' } : {}),
                ...(this.token ? { token: this.token } : {}),
                ...(this.csrfToken ? { 'CSRF-Token': this.csrfToken } : {})
            };
            const bodyData = !isFormData ? JSON.stringify(body) : body;

            const response = await fetch(
                `${this.apiUrl}${this.prefix}${url}${query}`,
                {
                    method,
                    headers,
                    credentials : 'include',
                    body        : method !== 'GET' ? bodyData : undefined
                }
            );

            const json = await response.json();

            if (response.status !== 200) {  // eslint-disable-line no-magic-numbers
                throw this.errorsHandler(json, response.status, url);
            }

            if (this.fetchError) this.clearFetchError();
            if (this.csrfError && url === 'csrf_token') {
                this.csrfError = false;
            }

            return json;
        } catch (error) {
            if (url === 'csrf_token') {
                this.csrfError = true;
                this.errorsHandler(error, 403, url);    // eslint-disable-line  no-magic-numbers
            } else if (!error?.isServer && !this.csrfError) {
                return this.handleFetchError(error);
            }

            this.clearFetchError();

            throw error;
        }
    }

    setToken = (token) => {
        this.token = token;
    }

    setCsrfToken = (token) => {
        this.csrfToken = token;
        localStorageUtils.saveData(CSRF_TOKEN_KEY, token);
    }

    clearFetchError = () => {
        this.fetchError = null;

        if (this.onFetchErrorClear) this.onFetchErrorClear();
    }

    handleFetchError(error) {
        this.fetchError = error;

        if (this.onFetchError) this.onFetchError(error);

        throw error;
    }

    errorsHandler(error, code, url) {
        if (this.onError) return this.onError(error, code, url);
    }

    setFetchErrorCb(cb) {
        this.onFetchError = cb;
    }

    setErrorCb(cb) {
        this.onError = cb;
    }

    setClearFetchErrorCb(cb) {
        this.onFetchErrorClear = cb;
    }

    setGetLangCb(cb) {
        this.getLang = cb;
    }
}
