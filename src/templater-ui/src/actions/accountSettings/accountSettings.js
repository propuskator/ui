import ActionsBase     from './../base';
import { getFormData } from './../../utils/formData';
import {
    FETCH_ACCOUNT_SETTINGS_REQUEST,
    FETCH_ACCOUNT_SETTINGS_SUCCESS,
    FETCH_ACCOUNT_SETTINGS_ERROR,
    UPDATE_ACCOUNT_SETTINGS_REQUEST,
    UPDATE_ACCOUNT_SETTINGS_SUCCESS,
    UPDATE_ACCOUNT_SETTINGS_ERROR,
    SEND_REPORT_REQUEST,
    SEND_REPORT_SUCCESS,
    SEND_REPORT_ERROR
} from './../../constants/actions/accountSettings';
import {
    SESSION_CKECKED
}          from './../../constants/actions/sessions';

export default class AccountSettings extends ActionsBase {
    constructor(...args) {
        super(...args);

        this.fetchAccountSettings  = this.fetchAccountSettings.bind(this);
        this.updateAccountSettings = this.updateAccountSettings.bind(this);
        this.updatePassword        = this.updatePassword.bind(this);
        this.updateUserAvatar      = this.updateUserAvatar.bind(this);
        this.sendReport            = this.sendReport.bind(this);

        this.connectBroker = void 0;
    }

    fetchAccountSettings({ isInit = false } = {}) {
        return async (dispatch) => {
            dispatch({ type: FETCH_ACCOUNT_SETTINGS_REQUEST });

            try {
                const response = await this.api.accountSettings.getData();

                dispatch({
                    type    : FETCH_ACCOUNT_SETTINGS_SUCCESS,
                    payload : {
                        id         : response?.id,
                        avatar_url : response?.avatar_url,
                        login      : response?.login
                    }
                });

                if (this.connectBroker) {
                    dispatch(this.connectBroker({
                        data : response?.mqttCredentials
                    }));
                }
            } catch (error) {
                dispatch({ type: FETCH_ACCOUNT_SETTINGS_ERROR });
                throw error;
            } finally {
                if (isInit) dispatch({ type: SESSION_CKECKED });
            }
        };
    }


    updateAccountSettings({ data, onSuccess, onError, onFinally } = {}) {
        return async (dispatch) => {
            dispatch({ type: UPDATE_ACCOUNT_SETTINGS_REQUEST });

            try {
                const response  = await this.api.accountSettings.edit(data);

                dispatch({
                    type    : UPDATE_ACCOUNT_SETTINGS_SUCCESS,
                    payload : {
                        accountSettings : {
                            id         : response?.id,
                            login      : response?.login,
                            avatar_url : response?.avatar_url
                        }
                    }
                });

                if (onSuccess) onSuccess();
            } catch (error) {
                dispatch({ type: UPDATE_ACCOUNT_SETTINGS_ERROR });

                if (onError) onError(error);
            } finally {
                if (onFinally) onFinally();
            }
        };
    }


    updatePassword({ data, onSuccess, onError, onFinally } = {}) {
        return async (dispatch) => {
            dispatch({ type: UPDATE_ACCOUNT_SETTINGS_REQUEST });

            try {
                await this.api.accountSettings.editPassword(data);

                dispatch({
                    type    : UPDATE_ACCOUNT_SETTINGS_SUCCESS,
                    payload : {
                        accountSettings : { }
                    }
                });

                if (onSuccess) onSuccess();
            } catch (error) {
                dispatch({ type: UPDATE_ACCOUNT_SETTINGS_ERROR });

                if (onError) onError(error);
            } finally {
                if (onFinally) onFinally();
            }
        };
    }

    updateUserAvatar({ data, onSuccess, onError, onFinally } = {}) {
        return async (dispatch) => {
            dispatch({ type: UPDATE_ACCOUNT_SETTINGS_REQUEST });

            try {
                const isFileExist = !!data?.avatarImg;
                const updatedProfile = {
                    avatar_url : ''
                };

                if (isFileExist) {
                    const keys = [
                        { key: 'avatarImg', asKey: 'file' }
                    ];
                    const formData = getFormData(data, keys);
                    const response = await this.api.files.uploadFile(formData);

                    updatedProfile.avatar_url = response?.path;
                }

                await dispatch(this.updateAccountSettings({
                    data : updatedProfile, onSuccess, onError, onFinally
                }));
            } catch (error) {
                dispatch({ type: UPDATE_ACCOUNT_SETTINGS_ERROR });
                if (onError) onError();
                if (onFinally) onFinally();
            }
        };
    }

    sendReport({ message, onSuccess, onFinally } = {}) {
        return async (dispatch) => {
            try {
                dispatch({ type: SEND_REPORT_REQUEST });

                const type = await this.api.references.getByName('reported_vendor_issues_types');

                await this.api.accountSettings.sendReport({ type: type[0], message });

                if (onSuccess) onSuccess();
                dispatch({ type: SEND_REPORT_SUCCESS });
            } catch (error) {
                dispatch({ type: SEND_REPORT_ERROR });
                throw error;
            } finally {
                if (onFinally) onFinally();
            }
        };
    }
}
