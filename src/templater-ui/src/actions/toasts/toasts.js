import { v4 as uuidv4 }          from 'uuid';
import ActionsBase               from './../base';
import { TOASTS_KEYS }           from './../../constants/toasts';
import {
    isUserLoggedInSelector
}                                from './../../selectors/sessions';
import {
    ADD_TOAST,
    REMOVE_TOAST,
    REMOVE_TOAST_BY_KEY
}                                from './../../constants/actions/toasts';

export default class Toasts extends ActionsBase {
    constructor(...args) {
        super(...args);

        this.addToast         = this.addToast.bind(this);
        this.removeToast      = this.removeToast.bind(this);
        this.removeToastByKey = this.removeToastByKey.bind(this);
        this.t                = (text) => text;
    }

    addToast(toastParams = {}) {
        return async (dispatch, getState) => {
            const {
                key,
                type,
                title,
                message,
                closeTimeout,
                preventDuplicate = true,
                showOnSessionDestroy = false,
                hideByTimeout = true,
                withCloseAbility = true,
                ...rest
            } = toastParams;

            const TOAST_DELAY = 300;

            setTimeout(() => {
                const state = getState();
                const currentToasts = state?.toasts;
                const isShowToast   = showOnSessionDestroy || isUserLoggedInSelector(state);

                const isFetchErrorExist = !!currentToasts.find(toast => toast.key === TOASTS_KEYS.fetchError);

                if (isFetchErrorExist) {
                    const availableToastsKeys = [ TOASTS_KEYS.networkError ];

                    if (!availableToastsKeys.includes(key)) return;
                }

                if (!hideByTimeout) {
                    const isExist = currentToasts.find(toast => toast.key === key);

                    if (isExist) return;
                }

                if (!isShowToast) return;

                if (preventDuplicate) {
                    const duplicates = currentToasts.filter(toast => toast.key === key);

                    duplicates.forEach((toast) => {
                        dispatch(this.removeToast(toast.id));
                    });
                }

                const toast = {
                    id      : uuidv4(),
                    timeout : closeTimeout,
                    type,
                    key,
                    title   : this.t(title),
                    message : this.t(message),
                    preventDuplicate,
                    hideByTimeout,
                    withCloseAbility,
                    showOnSessionDestroy,
                    ...rest
                };

                dispatch({
                    type : ADD_TOAST,
                    toast
                });
            }, TOAST_DELAY);
        };
    }

    removeToast(id) {
        return {
            type : REMOVE_TOAST,
            id
        };
    }

    removeToastByKey(key) {
        return async (dispatch, getState) => {
            const toasts = getState().toasts;
            const isExist = toasts.find(toast => toast.key === key);

            if (!isExist) return;

            dispatch({
                type : REMOVE_TOAST_BY_KEY,
                key
            });
        };
    }
}
