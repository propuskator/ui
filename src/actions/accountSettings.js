import { getFormData }                              from 'templater-ui/src/utils/formData';
import {
    SEND_REPORT_ERROR,
    SEND_REPORT_REQUEST,
    SEND_REPORT_SUCCESS
}                                                   from 'templater-ui/src/constants/actions/accountSettings';

import api                                          from 'ApiSingleton';
// import { sleep }       from 'Utils/helpers/index.js';
import sessionManager                               from 'Utils/sessions';


export const FETCH_ACCOUNT_SETTINGS_REQUEST = 'FETCH_ACCOUNT_SETTINGS_REQUEST';
export const FETCH_ACCOUNT_SETTINGS_SUCCESS = 'FETCH_ACCOUNT_SETTINGS_SUCCESS';
export const FETCH_ACCOUNT_SETTINGS_ERROR   = 'FETCH_ACCOUNT_SETTINGS_ERROR';

export const UPDATE_ACCOUNT_SETTINGS_REQUEST = 'UPDATE_ACCOUNT_SETTINGS_REQUEST';
export const UPDATE_ACCOUNT_SETTINGS_SUCCESS = 'UPDATE_ACCOUNT_SETTINGS_SUCCESS';
export const UPDATE_ACCOUNT_SETTINGS_ERROR   = 'UPDATE_ACCOUNT_SETTINGS_ERROR';


export function fetchAccountSettings() {
    return async (dispatch) => {
        dispatch({ type: FETCH_ACCOUNT_SETTINGS_REQUEST });

        try {
            const response = await api.accountSettings.getData();

            dispatch({
                type    : FETCH_ACCOUNT_SETTINGS_SUCCESS,
                payload : {
                    avatar    : response?.data?.avatar,
                    login     : response?.data?.login,
                    workspace : response?.data?.workspace
                }
            });
        } catch (error) {
            dispatch({ type: FETCH_ACCOUNT_SETTINGS_ERROR });
            throw error;
        }
    };
}


export function updateAccountSettings(data) {
    return async (dispatch) => {
        dispatch({ type: UPDATE_ACCOUNT_SETTINGS_REQUEST });

        try {
            const response = await api.accountSettings.edit(data);
            const newToken =   response.meta.newToken;

            dispatch({
                type    : UPDATE_ACCOUNT_SETTINGS_SUCCESS,
                payload : {
                    accountSettings : {
                        login : response?.data?.login
                    }
                }
            });
            if (newToken) sessionManager.setSession({ token: newToken });
        } catch (error) {
            dispatch({ type: UPDATE_ACCOUNT_SETTINGS_ERROR });
            throw error;
        }
    };
}


export function updateUserAvatar(data) {
    return async (dispatch) => {
        dispatch({ type: UPDATE_ACCOUNT_SETTINGS_REQUEST });

        try {
            const keys = [
                { key: 'avatarImg', asKey: 'avatarImg' }
            ];
            const formData = getFormData(data, keys);

            const response = await api.accountSettings.updateAvatar(formData);

            dispatch({
                type    : UPDATE_ACCOUNT_SETTINGS_SUCCESS,
                payload : {
                    accountSettings : {
                        avatar : response?.data?.avatar
                    }
                }
            });
        } catch (error) {
            dispatch({ type: UPDATE_ACCOUNT_SETTINGS_ERROR });
            throw error;
        }
    };
}

export function sendReport({ message, onSuccess, onFinally } = {}) {
    return async (dispatch) => {
        try {
            dispatch({ type: SEND_REPORT_REQUEST });

            const { data } = await api.references.getByName('reported_admin_issues_types');

            await api.accountSettings.sendReport({ type: data[0], message });

            if (onSuccess) onSuccess();
            dispatch({ type: SEND_REPORT_SUCCESS });
        } catch (error) {
            dispatch({ type: SEND_REPORT_ERROR });
            const { type, errors } = error;

            if (type === 'validation') {
                error.errors = errors.reduce((obj, err) => ({
                    ...obj,
                    [err.field] : err.message
                }), {});
            }

            throw error;
        } finally {
            if (onFinally) onFinally();
        }
    };
}
