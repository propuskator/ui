import {
    LOGOUT,
    LOGIN
} from './../constants/actions/sessions';

import {
    FETCH_ACCOUNT_SETTINGS_REQUEST,
    FETCH_ACCOUNT_SETTINGS_SUCCESS,
    FETCH_ACCOUNT_SETTINGS_ERROR,
    UPDATE_ACCOUNT_SETTINGS_SUCCESS
} from './../constants/actions/accountSettings';

const initialState = {
    id         : '',
    avatar_url : '',
    login      : '',
    isFetching : false,
    isError    : false
};

export default function accountSettings(state = initialState, action = {}) {
    const { type, payload = {} } = action;

    switch (type) {
        case LOGIN:
            return {
                ...state,
                id         : payload?.id,
                avatar_url : payload?.avatar_url,
                login      : payload?.login
            };
        case UPDATE_ACCOUNT_SETTINGS_SUCCESS:
            return { ...state, ...(payload?.accountSettings || {}) };
        case FETCH_ACCOUNT_SETTINGS_REQUEST:
            return { ...state, isFetching: true };
        case FETCH_ACCOUNT_SETTINGS_SUCCESS:
            return {
                ...state,
                isFetching : false,
                id         : payload?.id,
                avatar_url : payload?.avatar_url,
                login      : payload?.login
            };
        case FETCH_ACCOUNT_SETTINGS_ERROR:
            return { ...state, isFetching: false, isError: true };
        case LOGOUT:
            return { ...initialState };
        default:
            return state;
    }
}
