import {
    LOGIN,
    LOGOUT
} from 'Actions/sessions';

import {
    FETCH_ACCOUNT_SETTINGS_REQUEST,
    FETCH_ACCOUNT_SETTINGS_SUCCESS,
    FETCH_ACCOUNT_SETTINGS_ERROR,
    UPDATE_ACCOUNT_SETTINGS_SUCCESS
} from 'Actions/accountSettings';

const initialState = {
    avatar     : '',
    login      : '',
    workspace  : '',
    isFetching : false,
    isError    : false
};

export default function accountSettings(state = initialState, action = {}) {
    const { type, payload = {} } = action;

    switch (type) {
        case LOGIN:
            return {
                ...state,
                login  : payload?.login,
                avatar : payload?.avatar
            };
        case LOGOUT:
            return { ...initialState };
        case UPDATE_ACCOUNT_SETTINGS_SUCCESS:
            return { ...state, ...(payload?.accountSettings || {}) };
        case FETCH_ACCOUNT_SETTINGS_SUCCESS:
            return {
                ...state,
                isFetching : false,
                avatar     : payload?.avatar,
                login      : payload?.login,
                workspace  : payload?.workspace
            };
        case FETCH_ACCOUNT_SETTINGS_REQUEST:
            return { ...state, isFetching: true };
        case FETCH_ACCOUNT_SETTINGS_ERROR:
            return { ...state, isFetching: false, isError: true };
        default:
            return state;
    }
}
